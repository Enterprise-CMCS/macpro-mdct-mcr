// components
import { Box, Heading, Td, Text, Tr } from "@chakra-ui/react";
import { Table } from "components";
// constants
import { nonCompliantLabel } from "../../constants";
// styling
import { exportTableSx } from "./ExportedReportFieldTable";
// types
import { EntityShape, PlanOverlayReportPageShape } from "types";
// utils
import {
  getExceptionsNonComplianceCounts,
  getExceptionsNonComplianceKeys,
  parseCustomHtml,
  useStore,
} from "utils";

/*
 * Designed originally for the plan compliance portion of the NAAAR report
 * Expected entity is plans
 */
export const ExportedPlanOverlayReportSection = ({ section }: Props) => {
  const { report } = useStore();

  const plans = report?.fieldData?.plans;
  const standards = report?.fieldData?.standards ?? [];

  if (!plans) {
    return null;
  }

  // 438.68 display text
  const formVerbiage43868 = section.details.forms[0].verbiage;
  const complianceAssuranceHeading43868 = formVerbiage43868.heading;
  const complianceAssuranceHint43868 = formVerbiage43868.hint;
  const nonCompliantDetailsHeading43868 =
    section.details.forms[0].table.bodyRows[0][1];

  // 438.206 display text
  const formVerbiage438206 = section.details.forms[1].verbiage;
  const complianceAssuranceHeading438206 = formVerbiage438206.heading;
  const complianceAssuranceHint438206 = formVerbiage438206.hint;

  const displayPlansList = () => {
    return plans.map((plan: EntityShape) => {
      const answer43868 = plan?.planCompliance43868_assurance?.[0]?.value ?? "";
      const answer438206 =
        plan?.planCompliance438206_assurance?.[0]?.value ?? "";
      const isNotCompliant43868 = answer43868 === nonCompliantLabel;

      // counts
      const exceptionsNonComplianceKeys = getExceptionsNonComplianceKeys(plan);
      const { exceptionsCount, nonComplianceCount } =
        getExceptionsNonComplianceCounts(exceptionsNonComplianceKeys);
      const standardsTotalCount = standards.length;
      const exceptionsCountText = `Total: ${exceptionsCount} of ${standardsTotalCount}`;
      const nonComplianceCountText = `Total: ${nonComplianceCount} of ${standardsTotalCount}`;

      return (
        <Box key={plan.id}>
          <Heading as="h3" sx={sx.planNameHeading}>
            {plan.name}
          </Heading>
          {complianceTable(
            complianceAssuranceHeading43868,
            section.name,
            complianceAssuranceHint43868,
            answer43868
          )}
          {isNotCompliant43868 && (
            <>
              <Heading as="h4" sx={sx.h4}>
                {nonCompliantDetailsHeading43868}
              </Heading>
              <Heading as="h5" sx={sx.h5}>
                Non-compliant standards for 438.68
              </Heading>
              <Text sx={sx.count}>{nonComplianceCountText}</Text>
              <Heading as="h5" sx={sx.h5}>
                Exceptions standards for 438.68
              </Heading>
              <Text sx={sx.count}>{exceptionsCountText}</Text>
            </>
          )}
          {complianceTable(
            complianceAssuranceHeading438206,
            section.name,
            complianceAssuranceHint438206,
            answer438206
          )}
        </Box>
      );
    });
  };

  return (
    <Box data-testid="exportedPlanOverlayReportSection">
      {displayPlansList()}
    </Box>
  );
};

export interface Props {
  section: PlanOverlayReportPageShape;
}

const complianceTable = (
  heading: string,
  sectionName: string,
  hint: string,
  answer: string
) => {
  const headers = ["", "Indicator", "Response"];

  return (
    <>
      <Heading as="h4" sx={sx.h4}>
        {heading}
      </Heading>
      <Table
        sx={exportTableSx}
        className={"two-column"}
        content={{
          caption: sectionName,
          headRow: headers,
        }}
      >
        <Tr>
          <Td></Td>
          <Td>
            <Text sx={sx.fieldLabel}>{heading}</Text>
            <Text sx={sx.fieldHint}>{parseCustomHtml(hint)}</Text>
          </Td>
          <Td>{answer}</Td>
        </Tr>
      </Table>
    </>
  );
};

const sx = {
  planNameHeading: {
    fontSize: "xl",
    paddingBottom: "1.5rem",
  },
  fieldLabel: {
    fontSize: "sm",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  fieldHint: {
    lineHeight: "lg",
    color: "palette.gray_medium",
  },
  count: {
    color: "palette.gray_medium",
    fontWeight: "bold",
    paddingBottom: "1.5rem",
  },
  h4: {
    fontSize: "lg",
    paddingBottom: "1rem",
  },
  h5: {
    fontSize: "md",
    paddingBottom: "1.5rem",
  },
};
