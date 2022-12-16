// components
import { Box, Flex, Text } from "@chakra-ui/react";
// utils
import { AnyObject, ModalDrawerEntityTypes } from "types";

export const EntityCardBottomSection = ({
  entityType,
  formattedEntityData,
  printVersion,
  verbiage,
}: Props) => {
  switch (entityType) {
    case ModalDrawerEntityTypes.ACCESS_MEASURES:
      return (
        <>
          <Box sx={sx.highlightContainer}>
            <Flex>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>
                  {printVersion && "C2.V.4 "} Provider
                </Text>
                <Text sx={sx.subtext}>
                  {formattedEntityData?.provider ??
                    (printVersion && "Not Answered")}
                </Text>
              </Box>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>{printVersion && "C2.V.5 "} Region</Text>
                <Text sx={sx.subtext}>
                  {formattedEntityData?.region ??
                    (printVersion && "Not Answered")}
                </Text>
              </Box>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>
                  {printVersion && "C2.V.5 "} Population
                </Text>
                <Text sx={sx.subtext}>
                  {formattedEntityData?.population ??
                    (printVersion && "Not Answered")}
                </Text>
              </Box>
            </Flex>
          </Box>
          <Text sx={sx.subtitle}>
            {printVersion && "C2.V.7 "} Monitoring Methods
          </Text>
          <Text sx={sx.subtext}>
            {formattedEntityData?.monitoringMethods?.join(", ") ??
              (printVersion && "Not Answered")}
          </Text>
          <Text sx={sx.subtitle}>
            {printVersion && "C2.V.8 "} Frequency of oversight methods
          </Text>
          <Text sx={sx.subtext}>
            {formattedEntityData.methodFrequency ??
              (printVersion && "Not Answered")}
          </Text>
        </>
      );
    case ModalDrawerEntityTypes.SANCTIONS:
      return (
        <>
          <Text sx={sx.subtitle}>Sanction details</Text>
          <Box sx={sx.highlightContainer}>
            <Flex>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>
                  {printVersion && "D3.VIII.5 "} Instances of non-compliance
                </Text>
                <Text sx={sx.subtext}>
                  {formattedEntityData?.noncomplianceInstances ??
                    (printVersion && "Not Answered")}
                </Text>
              </Box>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>
                  {printVersion && "D3.VIII.6 "} Sanction amount
                </Text>
                <Text sx={sx.subtext}>
                  ${" "}
                  {formattedEntityData?.dollarAmount ??
                    (printVersion && "Not Answered")}
                </Text>
              </Box>
            </Flex>
            <Flex>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>
                  {printVersion && "D3.VIII.7 "} Date assessed
                </Text>
                <Text sx={sx.subtext}>
                  {formattedEntityData?.assessmentDate ??
                    (printVersion && "Not Answered")}
                </Text>
              </Box>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>
                  {printVersion && "D3.VIII.8 "} Remediation date non-compliance
                  was corrected
                </Text>
                <Text sx={sx.subtext}>
                  {(formattedEntityData?.remediationDate || "") ??
                    (printVersion && "Not Answered")}
                </Text>
              </Box>
            </Flex>
            <Text sx={sx.subtitle}>
              {printVersion && "D3.VIII.9 "} Corrective action plan
            </Text>
            <Text sx={sx.subtext}>
              {formattedEntityData?.correctiveActionPlan ??
                (printVersion && "Not Answered")}
            </Text>
          </Box>
        </>
      );
    case ModalDrawerEntityTypes.QUALITY_MEASURES:
      return (
        <>
          <Text sx={sx.resultsHeader}>Measure results</Text>
          {formattedEntityData?.isPartiallyComplete && (
            <Text sx={sx.missingResponseMessage}>
              {verbiage?.entityMissingResponseMessage ??
                (printVersion && "Not Answered")}
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
                    <Text sx={sx.planTitle}>{plan.name}</Text>
                    {printVersion && !plan.response ? (
                      <Text sx={sx.notAnswered}>Not Answered</Text>
                    ) : (
                      <Text sx={sx.planText}>
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
    default:
      return <Text>{entityType}</Text>;
  }
};

interface Props {
  entityType: string;
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
    marginBottom: "1rem",
    fontSize: "xs",
    fontWeight: "bold",
  },
  missingResponseMessage: {
    marginBottom: "1rem",
    fontSize: "xs",
    color: "palette.error_dark",
  },
  highlightContainer: {
    marginBottom: "1rem",
    padding: "1rem 1.5rem",
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
  planTitle: {
    marginBottom: ".25rem",
    fontSize: "sm",
    fontWeight: "bold",
  },
  planText: {
    fontSize: "sm",
  },
  notAnswered: {
    fontSize: "sm",
    color: "#9F142B",
  },
};
