import { isLocalStack } from "./local/util";
import { getSecret } from "./utils/secrets-manager";

export interface DeploymentConfigProperties {
  project: string;
  stage: string;
  isDev: boolean;
  vpcName: string;
  oktaMetadataUrl: string;
  bootstrapUsersPassword?: string;
  cloudfrontCertificateArn?: string;
  cloudfrontDomainName?: string;
  secureCloudfrontDomainName?: string;
  userPoolDomainPrefix?: string;
  vpnIpSetArn?: string;
  vpnIpv6SetArn?: string;
  brokerString: string;
  kafkaAuthorizedSubnetIds: string;
}

export const determineDeploymentConfig = async (stage: string) => {
  const project = process.env.PROJECT!;
  const isDev =
    isLocalStack || !["master", "main", "val", "production"].includes(stage);
  const secretConfigOptions = {
    ...(await loadDefaultSecret(project, stage)),
    ...(await loadStageSecret(project, stage)),
  };

  const config = {
    project,
    stage,
    isDev,
    ...secretConfigOptions,
  };
  if (config.cloudfrontDomainName) {
    config.secureCloudfrontDomainName = `https://${config.cloudfrontDomainName}/`;
  }

  if (!isLocalStack) {
    validateConfig(config);
  }

  return config;
};

export const loadDefaultSecret = async (project: string, stage?: string) => {
  if (stage === "bootstrap") {
    return {};
  } else {
    return JSON.parse((await getSecret(`${project}-default`))!);
  }
};

const loadStageSecret = async (project: string, stage: string) => {
  const secretName = `${project}-${stage}`;
  try {
    return JSON.parse((await getSecret(secretName))!);
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.warn(
      `Optional stage secret "${secretName}" not found: ${error.message}`
    );
    return {};
  }
};

function validateConfig(config: {
  [key: string]: any;
}): asserts config is DeploymentConfigProperties {
  const expectedKeys = [
    "project",
    "stage",
    "vpcName",
    "oktaMetadataUrl",
    "brokerString",
    "kafkaAuthorizedSubnetIds",
  ];

  const invalidKeys = expectedKeys.filter(
    (key) => !config[key] || typeof config[key] !== "string"
  );

  if (invalidKeys.length > 0) {
    throw new Error(
      `The following deployment config keys are missing or invalid: ${invalidKeys}`
    );
  }
}
