// components
import { Box, Heading, Td, Text, Tr } from "@chakra-ui/react";
import {
  Table,
  ExportedEntityDetailsTable,
  ExportedPlanComplianceCard,
} from "components";
// constants
import {
  exceptionsStatus,
  nonComplianceStatus,
  nonCompliantLabel,
  planComplianceStandardKey,
} from "../../constants";
// styling
import { exportTableSx } from "./ExportedReportFieldTable";
// types
import {
  EntityShape,
  EntityType,
  FormField,
  PlanOverlayReportPageShape,
} from "types";
import { NaaarStandardsTableShape } from "components/tables/SortableNaaarStandardsTable";
// utils
import {
  addExceptionsNonComplianceStatus,
  getExceptionsNonComplianceCounts,
  getExceptionsNonComplianceKeys,
  getFormattedEntityData,
  mapNaaarStandardsData,
  parseCustomHtml,
  useStore,
} from "utils";
// verbiage
import exportVerbiage from "verbiage/pages/naaar/naaar-export";

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

  const standardsData =
    mapNaaarStandardsData<NaaarStandardsTableShape>(standards);

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
  const nonCompliantDetailsHeading438206 =
    section.details.forms[1].table.bodyRows[0][1];
  const nonCompliantDetailsChildForm438206 =
    section.details.childForms[1].form.fields;

  const displayPlansList = () => {
    return plans.map((plan: EntityShape, index: number) => {
      const answer43868 = plan?.planCompliance43868_assurance?.[0]?.value;
      const answer438206 = plan?.planCompliance438206_assurance?.[0]?.value;
      const isNotCompliant43868 = answer43868 === nonCompliantLabel;
      const isNotCompliant438206 = answer438206 === nonCompliantLabel;

      // counts
      const exceptionsNonComplianceKeys = getExceptionsNonComplianceKeys(plan);
      const { exceptionsCount, nonComplianceCount } =
        getExceptionsNonComplianceCounts(exceptionsNonComplianceKeys);
      const standardsTotalCount = standards.length;
      const exceptionsCountText = `Total: ${exceptionsCount} of ${standardsTotalCount}`;
      const nonComplianceCountText = `Total: ${nonComplianceCount} of ${standardsTotalCount}`;

      const standardsWithStatuses = addExceptionsNonComplianceStatus(
        standardsData,
        exceptionsNonComplianceKeys,
        planComplianceStandardKey
      );

      const nonCompliantStandards = standardsWithStatuses.filter(
        (standard) => standard?.exceptionsNonCompliance === nonComplianceStatus
      );
      const exceptionsStandards = standardsWithStatuses.filter(
        (standard) => standard?.exceptionsNonCompliance === exceptionsStatus
      );

      const nonComplianceDetails = (standardData: NaaarStandardsTableShape) => (
        <ExportedPlanComplianceCard
          key={plan.id}
          standardData={standardData}
          planData={getFormattedEntityData(
            EntityType.PLANS,
            plan,
            report?.fieldData
          )}
          verbiage={exportVerbiage}
        />
      );

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
              {nonCompliantStandards.map(
                (standardData: NaaarStandardsTableShape) =>
                  nonComplianceDetails(standardData)
              )}
              <Heading as="h5" sx={sx.h5}>
                Exceptions standards for 438.68
              </Heading>
              <Text sx={sx.count}>{exceptionsCountText}</Text>
              {exceptionsStandards.map(
                (standardData: NaaarStandardsTableShape) =>
                  nonComplianceDetails(standardData)
              )}
            </>
          )}
          {complianceTable(
            complianceAssuranceHeading438206,
            section.name,
            complianceAssuranceHint438206,
            answer438206
          )}
          {isNotCompliant438206 && (
            <>
              <Heading as="h4" sx={sx.h4}>
                {nonCompliantDetailsHeading438206}
              </Heading>
              <ExportedEntityDetailsTable
                key={`table-${plan.id}`}
                fields={nonCompliantDetailsChildForm438206 as FormField[]}
                entity={plan}
                showHintText={false}
                caption={nonCompliantDetailsHeading438206}
                entityType={EntityType.PLANS}
                entityIndex={index}
              />
            </>
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
        sx={{ ...exportTableSx, ...sx.tableHeader }}
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
          <Td sx={sx.answerCell}>
            <Text sx={!answer ? sx.notAnsweredStyling : {}}>
              {answer ?? "Not answered"}
            </Text>
          </Td>
        </Tr>
      </Table>
    </>
  );
};

const sx = {
  tableHeader: {
    ".desktop &": {
      "&.two-column": {
        "th:first-of-type": {
          paddingLeft: "5rem",
        },
      },
    },
  },
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
  answerCell: {
    width: "51%",
  },
  notAnsweredStyling: {
    color: "palette.error_darker",
  },
  count: {
    color: "palette.gray_medium",
    fontWeight: "bold",
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
