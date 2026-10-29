// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { CustomResource, Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Provider } from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
import { Lambda } from "./lambda.ts";

interface SupportCaseCustomResourceProps {
  cloudfrontId: string;
  cloudfrontUrl: string;
  stackName: string;
  isDev: boolean;
}

export class SupportCaseCustomResource extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: SupportCaseCustomResourceProps
  ) {
    super(scope, id);

    const { cloudfrontId, cloudfrontUrl, stackName, isDev } = props;

    const handler = new Lambda(this, "support-case-handler", {
      entry: "deployment/constructs/support-case-handler.ts",
      timeout: Duration.minutes(1),
      stackName,
      isDev,
      additionalPolicies: [
        new PolicyStatement({
          actions: [
            "support:CreateCase",
            "support:ResolveCase",
            "support:AddCommunicationToCase",
          ],
          resources: ["*"],
        }),
      ],
    });

    const provider = new Provider(this, "support-case-provider", {
      onEventHandler: handler.lambda,
      logRetention: RetentionDays.THREE_YEARS, // exceeds the 30 month requirement
    });

    new CustomResource(this, "support-case-cr", {
      serviceToken: provider.serviceToken,
      properties: {
        CloudfrontId: cloudfrontId,
        CloudfrontUrl: cloudfrontUrl,
      },
    });
  }
}
