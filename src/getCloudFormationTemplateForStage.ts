import {
  CloudFormationClient,
  GetTemplateCommand,
  paginateDescribeStacks,
} from "@aws-sdk/client-cloudformation";

type Tag = {
  Key: string;
  Value: string;
};

async function getAllStacksForRegion(region: string) {
  const client = new CloudFormationClient({ region: region });
  const stacks = [];
  for await (const page of paginateDescribeStacks({ client }, {})) {
    stacks.push(...(page.Stacks || []));
  }
  return stacks;
}

export async function getAllStacksForStage(
  region: string,
  stage: string,
  addFilters?: Tag[]
) {
  let stacks = await getAllStacksForRegion(region);
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

export async function getCloudFormationTemplatesForStage(
  region: string,
  stage: string,
  filters?: Tag[]
): Promise<Record<string, any>> {
  const stacks = await getAllStacksForStage(region, stage, filters);

  // If no stacks found, return an empty object
  if (stacks.length === 0) {
    return {};
  }

  const cfnClient = new CloudFormationClient({ region });
  const templatesByStack: Record<string, any> = {};

  // For each matching stack, retrieve and parse its template
  for (const stack of stacks) {
    const { TemplateBody } = await cfnClient.send(
      new GetTemplateCommand({
        StackName: stack.StackName,
      })
    );

    let parsedTemplate: any;
    try {
      parsedTemplate = JSON.parse(TemplateBody ?? "");
    } catch {
      console.log("error, received yaml, need to update to handle");
      console.log(TemplateBody);
    }

    templatesByStack[stack.StackName!] = parsedTemplate;
  }

  return templatesByStack;
}
