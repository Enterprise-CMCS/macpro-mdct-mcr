// components
import { Box, Flex, Text } from "@chakra-ui/react";
// types
import { AnyObject, EntityType } from "types";

export const EntityCardBottomSection = ({
  entityType,
  formattedEntityData,
  printVersion,
  verbiage,
}: Props) => {
  const notAnswered = (
    <Text as="span" sx={sx.notAnswered}>
      Not answered
    </Text>
  );

  const providerText = () => {
    const provider = formattedEntityData?.provider;
    const details = formattedEntityData?.providerDetails;
    if (provider) {
      if (details) {
        return `${provider}: ${details}`;
      }
      return provider;
    }
    return printVersion && notAnswered;
  };

  switch (entityType) {
    case EntityType.ACCESS_MEASURES:
      return (
        <>
          <Box
            sx={sx.highlightContainer}
            className={
              !formattedEntityData?.provider ||
              !formattedEntityData.region ||
              !formattedEntityData.population
                ? "error"
                : ""
            }
          >
            <Flex>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>
                  {`${printVersion ? "C2.V.4 " : ""}Provider`}
                </Text>
                <Text sx={sx.subtext}>{providerText()}</Text>
              </Box>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>
                  {`${printVersion ? "C2.V.5 " : ""}Region`}
                </Text>
                <Text sx={sx.subtext}>
                  {formattedEntityData?.region || (printVersion && notAnswered)}
                </Text>
              </Box>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>
                  {`${printVersion ? "C2.V.6 " : ""}Population`}
                </Text>
                <Text sx={sx.subtext}>
                  {formattedEntityData?.population ||
                    (printVersion && notAnswered)}
                </Text>
              </Box>
            </Flex>
          </Box>
          <Text sx={sx.subtitle}>
            {`${printVersion ? "C2.V.7 " : ""}Monitoring Methods`}
          </Text>
          <Text sx={sx.subtext}>
            {formattedEntityData?.monitoringMethods?.join(", ") ||
              (printVersion && notAnswered)}
          </Text>
          <Text sx={sx.subtitle}>
            {`${printVersion ? "C2.V.8 " : ""}Frequency of oversight methods`}
          </Text>
          <Text sx={sx.subtext}>
            {formattedEntityData.methodFrequency ||
              (printVersion && notAnswered)}
          </Text>
        </>
      );
    case EntityType.SANCTIONS:
      return (
        <>
          <Text sx={sx.subtitle}>Sanction details</Text>
          <Box
            sx={sx.highlightContainer}
            className={
              !formattedEntityData?.noncomplianceInstances ||
              !formattedEntityData?.dollarAmount ||
              !formattedEntityData?.assessmentDate ||
              !formattedEntityData?.remediationCompleted ||
              !formattedEntityData?.correctiveActionPlan
                ? "error"
                : ""
            }
          >
            <Flex>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>
                  {`${
                    printVersion ? "D3.VIII.5 " : ""
                  }Instances of non-compliance`}
                </Text>
                <Text sx={sx.subtext}>
                  {formattedEntityData?.noncomplianceInstances ||
                    (printVersion && notAnswered)}
                </Text>
              </Box>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>
                  {`${printVersion ? "D3.VIII.6 " : ""}Sanction amount`}
                </Text>
                <Text sx={sx.subtext}>
                  {formattedEntityData?.dollarAmount ||
                    (printVersion && notAnswered)}
                </Text>
              </Box>
            </Flex>
            <Flex>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>
                  {`${printVersion ? "D3.VIII.7 " : ""}Date assessed`}
                </Text>
                <Text sx={sx.subtext}>
                  {formattedEntityData?.assessmentDate ||
                    (printVersion && notAnswered)}
                </Text>
              </Box>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>
                  {`${
                    printVersion ? "D3.VIII.8 " : ""
                  }Remediation date non-compliance was corrected`}
                </Text>
                <Text sx={sx.subtext}>
                  {[
                    formattedEntityData?.remediationCompleted,
                    formattedEntityData?.remediationDate,
                  ].join(" ") ||
                    (printVersion && notAnswered)}
                </Text>
              </Box>
            </Flex>
            <Text sx={sx.subtitle}>
              {`${printVersion ? "D3.VIII.9 " : ""}Corrective action plan`}
            </Text>
            <Text sx={sx.subtext}>
              {formattedEntityData?.correctiveActionPlan ||
                (printVersion && notAnswered)}
            </Text>
          </Box>
        </>
      );
    case EntityType.QUALITY_MEASURES:
      return (
        <>
          <Text sx={sx.resultsHeader}>Measure results</Text>
          {formattedEntityData?.isPartiallyComplete && (
            <Text sx={sx.missingResponseMessage}>
              {verbiage?.entityMissingResponseMessage ||
                (printVersion && notAnswered)}
            </Text>
          )}
          {formattedEntityData?.perPlanResponses?.map(
            (plan: { name: string; response: string }) => (
              <Box
                key={plan.name + plan.response}
                sx={sx.highlightContainer}
                className={!plan.response ? "error" : ""}
              >
                <Flex>
                  <Box sx={sx.highlightSection}>
                    <Text sx={sx.subtitle}>{plan.name}</Text>
                    {printVersion && !plan.response ? (
                      notAnswered
                    ) : (
                      <Text sx={sx.subtext}>
                        {plan.response || verbiage?.entityEmptyResponseMessage}
                      </Text>
                    )}
                  </Box>
                </Flex>
              </Box>
            )
          )}
        </>
      );
    case EntityType.STANDARDS:
      return (
        <Box sx={{ ...sx.highlightContainer, padding: "0.5rem" }}>
          <Text sx={{ ...sx.subtitle, marginTop: "0" }}>Provider type(s)</Text>
          <Text sx={sx.subtext}>{formattedEntityData.provider}</Text>
          <Flex>
            <Box sx={sx.standardDetailsBoxes}>
              <Text sx={sx.subtitle}>Analysis method(s)</Text>
              <Text sx={sx.subtext}>{formattedEntityData.analysisMethods}</Text>
            </Box>
            <Box sx={sx.standardDetailsBoxes}>
              <Text sx={sx.subtitle}>Region</Text>
              <Text sx={sx.subtext}>{formattedEntityData.region}</Text>
            </Box>
            <Box sx={sx.standardDetailsBoxes}>
              <Text sx={sx.subtitle}>Population</Text>
              <Text sx={sx.subtext}>{formattedEntityData.population}</Text>
            </Box>
          </Flex>
        </Box>
      );
    default:
      return <Text>{entityType}</Text>;
  }
};

interface Props {
  entityType: EntityType;
  formattedEntityData: AnyObject;
  printVersion?: boolean;
  verbiage?: {
    entityMissingResponseMessage?: string;
    entityEmptyResponseMessage?: string;
  };
}

const sx = {
  subtitle: {
    marginTop: "1rem",
    fontSize: "xs",
    fontWeight: "bold",
  },
  subtext: {
    marginTop: "0.25rem",
    fontSize: "sm",
  },
  resultsHeader: {
    marginY: "1rem",
    fontSize: "xs",
    fontWeight: "bold",
  },
  missingResponseMessage: {
    marginBottom: "1rem",
    fontSize: "xs",
    color: "palette.error_dark",
  },
  highlightContainer: {
    marginTop: "1rem",
    marginBottom: "1rem",
    padding: "0 1.5rem 1rem",
    background: "palette.secondary_lightest",
    borderRadius: "3px",
    "&.error": {
      background: "palette.error_lightest",
    },
    "&:last-of-type": {
      marginBottom: 0,
    },
  },
  highlightSection: {
    width: "100%",
    marginLeft: "1rem",
    ":nth-of-type(1)": {
      marginLeft: 0,
    },
  },
  notAnswered: {
    fontSize: "sm",
    color: "palette.error_darker",
  },
  standardDetailsBoxes: {
    width: "10.5rem",
    marginRight: "3rem",
  },
};
