// components
import { Box, Flex, Text } from "@chakra-ui/react";
// utils
import { AnyObject, ModalDrawerEntityTypes } from "types";

export const EntityCardBottomSection = ({
  entityType,
  formattedEntityData,
}: Props) => {
  switch (entityType) {
    case ModalDrawerEntityTypes.ACCESS_MEASURES:
      return (
        <>
          <Box sx={sx.highlightContainer}>
            <Flex>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>Provider</Text>
                <Text sx={sx.subtext}>{formattedEntityData?.provider}</Text>
              </Box>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>Region</Text>
                <Text sx={sx.subtext}>{formattedEntityData?.region}</Text>
              </Box>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>Population</Text>
                <Text sx={sx.subtext}>{formattedEntityData?.population}</Text>
              </Box>
            </Flex>
          </Box>
          <Text sx={sx.subtitle}>Monitoring Methods</Text>
          <Text sx={sx.subtext}>
            {formattedEntityData?.monitoringMethods.join(", ")}
          </Text>
          <Text sx={sx.subtitle}>Frequency of oversight methods</Text>
          <Text sx={sx.subtext}>{formattedEntityData.methodFrequency}</Text>
        </>
      );
    case ModalDrawerEntityTypes.SANCTIONS:
      return (
        <>
          <Text sx={sx.subtitle}>Sanction Details</Text>
          <Box sx={sx.highlightContainer}>
            <Flex>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>Instances of non-compliance</Text>
                <Text sx={sx.subtext}>
                  {formattedEntityData?.noncomplianceInstances}
                </Text>
              </Box>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>Sanction amount</Text>
                <Text sx={sx.subtext}>
                  $ {formattedEntityData?.dollarAmount}
                </Text>
              </Box>
            </Flex>
            <Flex>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>Date assessed</Text>
                <Text sx={sx.subtext}>
                  {formattedEntityData?.assessmentDate}
                </Text>
              </Box>
              <Box sx={sx.highlightSection}>
                <Text sx={sx.subtitle}>
                  Remediation date non-compliance was corrected
                </Text>
                <Text sx={sx.subtext}>
                  {formattedEntityData?.remediationDate}
                </Text>
              </Box>
            </Flex>
            <Text sx={sx.subtitle}>Corrective action plan</Text>
            <Text sx={sx.subtext}>
              {formattedEntityData?.correctiveActionPlan}
            </Text>
          </Box>
        </>
      );
    case ModalDrawerEntityTypes.QUALITY_MEASURES:
      return (
        <>
          <Text sx={sx.resultsHeader}>Measure results</Text>
          {formattedEntityData?.isPartiallyComplete && (
            <Text sx={sx.missingPlanResponse}>
              Missing measure results for some plans.
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
                    <Text sx={sx.planText}>
                      {plan.response || "Error: no results entered"}
                    </Text>
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
  missingPlanResponse: {
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
};
