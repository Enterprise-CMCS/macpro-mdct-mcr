import {
  CloudFormationClient,
  DescribeStacksCommand,
  paginateDescribeStacks,
  paginateListStackResources,
  DeleteStackCommand,
  waitUntilStackDeleteComplete,
} from "@aws-sdk/client-cloudformation";

import {
  S3Client,
  PutBucketVersioningCommand,
  ListObjectVersionsCommand,
  DeleteObjectsCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";
import * as readlineSync from "readline-sync";

type Tag = {
  Key: string;
  Value: string;
};

export class ServerlessStageDestroyer {
  public async destroy(
    region: string,
    stage: string,
    options: {
      filters: Tag[];
      verify: boolean;
      wait: boolean;
      bucketsToSkip?: string[];
    }
  ) {
    const filters = options.filters || [];
    const verify = options.verify !== false;
    const wait = options.wait !== false;
    // First, check if a protected stage name has been passed, and fail if so.
    const bucketsToSkip = options.bucketsToSkip || [];

    this.checkForProtectedStage(stage);

    // Second, find all stacks that match the stage and any additional tag filters.
    let stacksToDestroy = await this.getAllStacksForStage(
      region,
      stage,
      filters
    );

    if (stacksToDestroy.length === 0) {
      console.log("No stacks matched... Nothing to delete... Exiting...");
      return;
    }

    // Check if any of the stacks have termination protection enabled.
    await this.checkForTerminationProtection(region, stacksToDestroy);

    // Third, show the stacks identified for destroy, and ask the user to confirm before proceeding.
    //   This underlying function is bypassed when CI=true
    if (verify) {
      this.confirmDestroyCommand(
        stage,
        stacksToDestroy.map((a) => `${a.StackName}`)
      );
    }

    // Fourth, destroy each stack.
    for (let i of stacksToDestroy || []) {
      await this.destroyStack(region, `${i.StackName}`, bucketsToSkip);
    }

    // Fifth, wait for stacks to be deleted.
    if (wait) {
      let waiters = [];
      for (let i of stacksToDestroy || []) {
        waiters.push(this.ensureStackIsDeleted(region, `${i.StackName}`));
      }
      await Promise.all(waiters);
    }
  }

  private async checkForTerminationProtection(region: string, stacks: any[]) {
    const client = new CloudFormationClient({ region: region });
    for (const stack of stacks) {
      let describeStacksCommandResponse = (
        await client.send(
          new DescribeStacksCommand({
            StackName: stack.StackName,
          })
        )
      ).Stacks;
      let stackDetails = describeStacksCommandResponse
        ? describeStacksCommandResponse[0]
        : { EnableTerminationProtection: undefined };
      if (stackDetails.EnableTerminationProtection) {
        throw "ERROR:  At least one stack was found to have termination protection enabled.  Refusing to continue.";
      }
    }
  }

  private async ensureStackIsDeleted(region: string, stack: string) {
    console.log(`Waiting for stack ${stack} to be deleted...`);
    const client = new CloudFormationClient({ region: region });
    await waitUntilStackDeleteComplete(
      {
        client: client,
        maxWaitTime: 7200,
      },
      {
        StackName: stack,
      }
    );
  }

  private async getAllStacksForRegion(region: string) {
    const client = new CloudFormationClient({ region: region });
    const stacks = [];
    for await (const page of paginateDescribeStacks({ client }, {})) {
      stacks.push(...(page.Stacks || []));
    }
    return stacks;
  }

  private async getAllStacksForStage(
    region: string,
    stage: string,
    addFilters?: Tag[]
  ) {
    let stacks = await this.getAllStacksForRegion(region);
    const matchTags = [
      {
        Key: "STAGE",
        Value: stage,
      },
    ];
    matchTags.push(...(addFilters || []));
    for (let matchTag of matchTags) {
      stacks = stacks.filter((i) =>
        i.Tags?.find((j) => j.Key == matchTag.Key && j.Value == matchTag.Value)
      );
    }
    return stacks;
  }

  private checkForProtectedStage(stage: string) {
    // Another safeguard against destroying protected stages
    if (stage.toLowerCase().includes("prdddod")) {
      throw `
          **********************************************************************
          You've requested a destroy for a protected stage (${stage}).
          The destroy operation has been aborted.
          **********************************************************************
        `;
    }
  }

  private confirmDestroyCommand(stage: string, markedStacks: String[]) {
    var confirmation = readlineSync.question(`
        ********************************* STOP *******************************
        You've requested a destroy for stage: ${stage}.
        Continuing will irreversibly delete all data and infrastructure
        associated with ${stage}.
        The following Cloudformation stacks and their underlying resources
        willbe permanently deleted:

        ${markedStacks}

        Do you really want to destroy it?
        Re-enter the stage name to continue:
        **********************************************************************
      `);
    if (confirmation != stage) {
      throw `
          **********************************************************************
          The destroy operation has been aborted.
          **********************************************************************
        `;
    }
  }

  private async getBucketsForStack(region: string, stack: string) {
    const client = new CloudFormationClient({ region: region });
    const buckets = [];
    for await (const page of paginateListStackResources(
      { client },
      { StackName: stack }
    )) {
      // The spread operator was causing an error, so using a for loop
      for (let i of page.StackResourceSummaries || []) {
        if (i.ResourceType == "AWS::S3::Bucket") {
          buckets.push(i.PhysicalResourceId);
        }
      }
    }
    return buckets;
  }

  private async deleteVersions(bucket: string, client: S3Client) {
    // Get all versions
    let objectVersions = await client.send(
      new ListObjectVersionsCommand({
        Bucket: bucket,
      })
    );

    // Delete all versions
    if (objectVersions.Versions) {
      let versionsToDelete = [];
      for (let i of objectVersions.Versions) {
        versionsToDelete.push({
          Key: i.Key,
          VersionId: i.VersionId,
        });
      }
      await client.send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: {
            Objects: versionsToDelete,
          },
        })
      );
    }

    // Delete all delete markers
    if (objectVersions.DeleteMarkers) {
      let deleteMarkersToDelete = [];
      for (let i of objectVersions.DeleteMarkers) {
        deleteMarkersToDelete.push({
          Key: i.Key,
          VersionId: i.VersionId,
        });
      }
      await client.send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: {
            Objects: deleteMarkersToDelete,
          },
        })
      );
    }

    if (objectVersions.Versions || objectVersions.DeleteMarkers) {
      await this.deleteVersions(bucket, client);
    }
  }

  public async destroyStack(
    region: string,
    stack: string,
    bucketsToSkip: string[] = []
  ) {
    console.log(`Destroying stack:  ${stack}...`);

    // Find buckets belonging to the stack
    let bucketsToEmpty = await this.getBucketsForStack(region, stack);
    const client = new S3Client({ region: region });

    // For each bucket to destroy
    for (let bucket of bucketsToEmpty) {
      if (bucketsToSkip.includes(bucket!)) {
        console.log(
          `    Skipping emptying bucket ${bucket} as it is in the skip list.`
        );
        continue;
      }

      console.log(`    Emptying bucket ${bucket}`);

      // Check if the bucket was removed outside of CloudFormation's knowledge.
      try {
        await client.send(
          new HeadBucketCommand({
            Bucket: bucket,
          })
        );
      } catch {
        continue;
      }

      // Suspend versioning on the bucket
      await client.send(
        new PutBucketVersioningCommand({
          Bucket: bucket,
          VersioningConfiguration: {
            Status: "Suspended",
          },
        })
      );

      // Put a policy denying any puts or gets
      await client.send(
        new PutBucketPolicyCommand({
          Bucket: bucket,
          Policy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["s3:GetObject", "s3:PutObject"],
                Effect: "Deny",
                Resource: `arn:aws:s3:::${bucket}/*`,
                Principal: "*",
              },
            ],
          }),
        })
      );

      // Delete all object versions and delete markers
      await this.deleteVersions(bucket || "", client);
    }

    // Destroy the stack
    console.log(`    Sending cloudformation delete for ${stack}`);
    const cloudformation = new CloudFormationClient({ region: region });
    await cloudformation.send(
      new DeleteStackCommand({
        StackName: stack,
      })
    );
  }
}
