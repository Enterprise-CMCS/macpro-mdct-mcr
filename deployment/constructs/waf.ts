import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CfnWebACL, CfnLoggingConfiguration } from "aws-cdk-lib/aws-wafv2";
import { LogGroup } from "aws-cdk-lib/aws-logs";

interface WafProps {
  readonly name: string;
  readonly blockByDefault?: boolean;
  readonly blockRequestBodyOver8KB?: boolean;
}

export class WafConstruct extends Construct {
  public readonly webAcl: CfnWebACL;
  public readonly logGroup: LogGroup;

  constructor(
    scope: Construct,
    id: string,
    props: WafProps,
    scopeType: string
  ) {
    super(scope, id);

    const {
      name,
      blockByDefault = true,
      blockRequestBodyOver8KB = true,
    } = props;

    const commonRuleOverrides: CfnWebACL.RuleActionOverrideProperty[] = [];
    if (!blockRequestBodyOver8KB) {
      commonRuleOverrides.push({
        name: "SizeRestrictions_BODY",
        actionToUse: { count: {} },
      });
    }

    this.logGroup = new LogGroup(this, "LogGroup", {
      logGroupName: `aws-waf-logs-${name}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.webAcl = new CfnWebACL(this, "WebACL", {
      scope: scopeType,
      defaultAction: blockByDefault ? { block: {} } : { allow: {} },
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        sampledRequestsEnabled: true,
        metricName: `${name}-webacl`,
      },
      rules: [
        {
          name: "DDOSRateLimitRule",
          priority: 10,
          action: { block: {} },
          statement: {
            rateBasedStatement: {
              limit: 5000,
              aggregateKeyType: "IP",
            },
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: `${name}-DDOSRateLimitRuleMetric`,
          },
        },
        {
          name: "AWSCommonRule",
          priority: 20,
          overrideAction: { none: {} },
          statement: {
            managedRuleGroupStatement: {
              vendorName: "AWS",
              name: "AWSManagedRulesCommonRuleSet",
              ruleActionOverrides: commonRuleOverrides,
            },
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: `${name}-AWSCommonRuleMetric`,
          },
        },
        {
          name: "AWSManagedRulesAmazonIpReputationList",
          priority: 30,
          overrideAction: { none: {} },
          statement: {
            managedRuleGroupStatement: {
              vendorName: "AWS",
              name: "AWSManagedRulesAmazonIpReputationList",
            },
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: `${name}-AWSManagedRulesAmazonIpReputationListMetric`,
          },
        },
        {
          name: "AWSManagedRulesKnownBadInputsRuleSet",
          priority: 40,
          overrideAction: { none: {} },
          statement: {
            managedRuleGroupStatement: {
              vendorName: "AWS",
              name: "AWSManagedRulesKnownBadInputsRuleSet",
            },
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: `${name}-AWSManagedRulesKnownBadInputsRuleSetMetric`,
          },
        },
        {
          name: "allow-usa-plus-territories",
          priority: 50,
          action: { allow: {} },
          statement: {
            geoMatchStatement: {
              countryCodes: [
                "AS",
                "FM",
                "GU",
                "MH",
                "MP",
                "PR",
                "PW",
                "UM",
                "US",
                "VI",
              ],
            },
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: `${name}-allow-usa-plus-territories-metric`,
          },
        },
      ],
      name: `${name}`,
    });

    new CfnLoggingConfiguration(this, "LoggingConfiguration", {
      resourceArn: this.webAcl.attrArn,
      logDestinationConfigs: [this.logGroup.logGroupArn],
    });
  }
}
