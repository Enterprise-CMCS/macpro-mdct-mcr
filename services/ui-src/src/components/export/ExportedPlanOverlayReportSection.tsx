// components
import { Heading, Td, Text, Tr } from "@chakra-ui/react";
import { Table } from "components";
import { getCounts } from "components/overlays/PlanComplianceTableOverlay";
import { exportTableSx } from "./ExportedReportFieldTable";
// constants
import { nonCompliantLabel, planComplianceStandardKey } from "../../constants";
// types
import { EntityShape, PlanOverlayReportPageShape } from "types";
// utils
import { parseCustomHtml, useStore } from "utils";

/*
 * Designed originally for the plan compliance portion of the NAAAR report
 * Expected entity is plans
 */
export const ExportedPlanOverlayReportSection = ({ section }: Props) => {
  const { report } = useStore();

  const plans = report?.fieldData?.plans;
  const standards = report?.fieldData?.standards || [];

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

  return plans.map((plan: EntityShape) => {
    const answer43868 = plan.planCompliance43868_assurance[0].value;
    const answer438206 = plan.planCompliance438206_assurance[0].value;
    const isNotCompliant43868 = answer43868 === nonCompliantLabel;

    const { exceptionsCountDisplayText, nonComplianceCountDisplayText } =
      getCounts(plan, planComplianceStandardKey, standards, {});

    return (
      <>
        <Heading as="h3" sx={sx.h3}>
          {plan.name}
        </Heading>
        {complianceTable(
          complianceAssuranceHeading43868,
          section.name,
          complianceAssuranceHint43868,
          answer43868
        )}
        {isNotCompliant43868 ? (
          <>
            <Heading as="h4" sx={sx.h4}>
              {nonCompliantDetailsHeading43868}
            </Heading>
            <Heading as="h5" sx={sx.h5}>
              Non-compliant standards for 438.68
            </Heading>
            <Text sx={sx.count}>{exceptionsCountDisplayText}</Text>
            <Heading as="h5" sx={sx.h5}>
              Exceptions standards for 438.68
            </Heading>
            <Text sx={sx.count}>{nonComplianceCountDisplayText}</Text>
          </>
        ) : null}
        {complianceTable(
          complianceAssuranceHeading438206,
          section.name,
          complianceAssuranceHint438206,
          answer438206
        )}
      </>
    );
  });
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
  h3: {
    fontSize: "xl",
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
