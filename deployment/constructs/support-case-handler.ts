import {
  SupportClient,
  CreateCaseCommand,
  ResolveCaseCommand,
  AddCommunicationToCaseCommand,
} from "@aws-sdk/client-support";

const supportClient = new SupportClient();

const createSupportCase = async (
  cloudfrontId: string,
  cloudfrontUrl: string
) => {
  const body = `
    Distribution ID (E1234567890): ${cloudfrontId}
    Service: CloudFront
    Category: Distribution Issue
    Severity: General guidance (24h first-response time target)
    Subject: CMS CloudFront distro SRR onboarding
    Description: Requesting expedited U.S.-only SRR onboarding for: ${cloudfrontUrl}
    Reference case #175512056000814.
    `;

  const command = new CreateCaseCommand({
    subject: "CMS CloudFront distro SRR onboarding",
    communicationBody: body,
    severityCode: "low",
    categoryCode: "distribution-issue",
    serviceCode: "amazon-cloudfront",
    ccEmailAddresses: ["cms-cloud-aws-operations@samtek.io"],
  });
  const response = await supportClient.send(command);
  console.log("Successfully created case:", response.caseId);
  return { caseId: response.caseId };
};

const resolveSupportCase = async (caseId: string) => {
  await supportClient.send(
    new AddCommunicationToCaseCommand({
      caseId,
      communicationBody:
        "The CloudFront distribution associated with this case has been deleted. This case can be closed.",
    })
  );
  const command = new ResolveCaseCommand({ caseId });
  await supportClient.send(command);
  console.log("Successfully resolved case:", caseId);
};

export const handler = async (event: any, _: any) => {
  console.log("Event:", JSON.stringify(event, null, 2));
  const { RequestType, ResourceProperties, PhysicalResourceId } = event;
  const { CloudfrontId, CloudfrontUrl } = ResourceProperties;

  switch (RequestType) {
    case "Create":
      const createResponse = await createSupportCase(
        CloudfrontId,
        CloudfrontUrl
      );
      return {
        PhysicalResourceId: createResponse.caseId,
        Data: { CaseId: createResponse.caseId },
      };
    case "Update":
      // Do nothing on update
      return {
        PhysicalResourceId,
      };
    case "Delete":
      await resolveSupportCase(PhysicalResourceId);
      return {
        PhysicalResourceId,
      };
    default:
      throw new Error(`Unsupported request type: ${RequestType}`);
  }
};
