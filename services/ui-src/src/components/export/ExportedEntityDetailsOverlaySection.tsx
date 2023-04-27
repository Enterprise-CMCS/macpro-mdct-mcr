import { Fragment, useContext } from "react";
import uuid from "react-uuid";
// components
import {
  ExportedSectionHeading,
  ExportedEntityDetailsTable,
  ReportContext,
} from "components";
import { Box, Heading } from "@chakra-ui/react";
// types
import {
  EntityShape,
  FormField,
  FormLayoutElement,
  ModalOverlayReportPageShape,
  ReportType,
} from "types";
// utils
import { assertExhaustive, getEntityDetailsMLR, renderHtml } from "utils";
// verbiage
import mcparVerbiage from "../../verbiage/pages/mcpar/mcpar-export";
import mlrVerbiage from "../../verbiage/pages/mlr/mlr-export";

const exportVerbiageMap: { [key in ReportType]: any } = {
  MCPAR: mcparVerbiage,
  MLR: mlrVerbiage,
  NAAAR: undefined,
};

export const ExportedEntityDetailsOverlaySection = ({
  section,
  ...props
}: ExportedEntityDetailsOverlaySectionProps) => {
  const { report } = useContext(ReportContext);
  const entityType = section.entityType;

  return (
    <Box sx={sx.sectionHeading} {...props}>
      <ExportedSectionHeading
        heading={exportVerbiageMap[report?.reportType as ReportType]}
        reportType={report?.reportType}
        verbiage={{
          ...section.verbiage,
          intro: {
            ...section.verbiage.intro,
            info: undefined,
            exportSectionHeader: undefined,
            spreadsheet: "MLR Reporting",
          },
        }}
      />
      {renderEntityDetailTables(
        report?.reportType as ReportType,
        report?.fieldData[entityType] ?? [],
        section
      )}
    </Box>
  );
};

export interface ExportedEntityDetailsOverlaySectionProps {
  section: ModalOverlayReportPageShape;
}
/**
 * Split a list of form fields by the "sectionHeader" layout element type.
 * This allows returning distinct tables for each section, rather than one large one.
 *
 * In the returned FormField sections, the first element is the section header.
 *
 * @param formFields List of form fields, possibly containing section headers
 * @returns array of arrays containing form field elements representing a section
 */
export function getFormSections(
  formFields: (FormField | FormLayoutElement)[]
): (FormLayoutElement | FormField)[][] {
  const formSections: (FormLayoutElement | FormField)[][] = [];

  let currentSection: (FormField | FormLayoutElement)[] = [];
  for (let field of formFields) {
    if (field.type === "sectionHeader") {
      if (currentSection.length > 0) {
        formSections.push(currentSection);
      }
      currentSection = [field];
    } else {
      currentSection.push(field);
    }
  }
  formSections.push(currentSection);

  return formSections;
}

/**
 *
 * @param entities entities for entity type
 * @param section form json for section
 * @param formSections form fields broken down into sections
 * @param report report field data
 * @returns entity table and heading information for each section
 */
export function getEntityTableComponents(
  entities: EntityShape[],
  section: ModalOverlayReportPageShape,
  formSections: (FormField | FormLayoutElement)[][]
) {
  return entities?.map((entity, idx) => {
    const {
      report_programName,
      eligibilityGroup,
      reportingPeriod,
      report_planName,
    } = getEntityDetailsMLR(entity);

    const programInfo = [
      report_programName,
      eligibilityGroup(),
      reportingPeriod,
      report_planName,
    ];

    return (
      <Box key={uuid()}>
        <Box sx={sx.entityInformation}>
          <Heading sx={sx.entityHeading} fontSize={"xl"}>
            {idx + 1}. {section.verbiage.intro.subsection} for:
          </Heading>
          <Heading sx={sx.programInfo} fontSize={"xl"}>
            <ul>
              {programInfo.map((field, index) => (
                <li key={index}>{renderHtml(field)}</li>
              ))}
            </ul>
          </Heading>
        </Box>
        {formSections.map((fields, idx) => {
          const filteredFields = fields.filter(
            (field) => field.type !== "sectionContent"
          );
          const header = filteredFields[0];
          return (
            <Fragment key={`tableContainer-${idx}`}>
              {header.type === "sectionHeader" && (
                <Heading size={"md"} as="h4" key={`heading-${idx}`}>
                  {header.props?.content}
                </Heading>
              )}
              <ExportedEntityDetailsTable
                key={`table-${idx}`}
                fields={filteredFields.slice(1) as FormField[]}
                entity={entity}
                showHintText={false}
              />
            </Fragment>
          );
        })}
      </Box>
    );
  });
}

/**
 * Render entity detail table(s) conditionally based on report type.
 *
 * @param reportType report type of report
 * @param entities entities for entity type
 * @param section form json section
 * @param report report data
 * @returns array of exported entity table components
 */
export function renderEntityDetailTables(
  reportType: ReportType,
  entities: EntityShape[],
  section: ModalOverlayReportPageShape
) {
  switch (reportType) {
    case ReportType.MLR: {
      const formSections = getFormSections(section.overlayForm?.fields ?? []);
      return getEntityTableComponents(entities, section, formSections);
    }
    case ReportType.MCPAR:
    case ReportType.NAAAR:
      throw new Error(
        `The entity detail table for report type '${reportType}' have not been implemented.`
      );
    default:
      assertExhaustive(reportType);
      throw new Error(
        `The entity detail table for report type '${reportType}' have not been implemented.`
      );
  }
}

const sx = {
  root: {
    marginBottom: "1rem",
    width: "150%",
    "tr, th": {
      verticalAlign: "bottom",
      lineHeight: "base",
      borderBottom: "1px solid",
      borderColor: "palette.gray_lighter",
    },
    thead: {
      //this will prevent generating a new header whenever the table spills over in another page
      display: "table-row-group",
    },
    td: {
      p: {
        lineHeight: "1.25rem",
      },
      padding: "0.75rem 0.5rem",
      borderStyle: "none",
      fontWeight: "normal",
      color: "palette.base",
      ".shrink &": {
        padding: "0.375rem 0rem",
      },
      ".mobile &": {
        fontSize: "xs",
      },
      verticalAlign: "middle",
    },
    th: {
      maxWidth: "100%",
      paddingBottom: "0.375rem",
      fontWeight: "bold",
      lineHeight: "lg",
      color: "palette.gray_medium",
      ".shrink &": {
        padding: "0.375rem 0rem",
      },
      "&:first-of-type": {
        paddingLeft: 0,
      },
    },
    ".desktop &": {
      "&.two-column": {
        "th:first-of-type": {
          paddingLeft: "6rem",
        },
      },
    },
  },
  tableIndex: {
    color: "palette.gray_medium",
    fontWeight: "bold",
  },
  statusIcon: {
    paddingLeft: "1rem",
    img: {
      maxWidth: "fit-content",
    },
  },
  emptyState: {
    margin: "0 auto",
    textAlign: "center",
    paddingBottom: "5rem",
  },
  entityInformation: {
    padding: "1rem 0 1rem 0",
    fontWeight: "bold",
  },
  entityHeading: {
    padding: "2rem 0 0.5rem 0",
    color: "palette.gray_medium",
    width: "110%",
  },
  sectionHeading: {
    padding: "1.5rem 0 0 0",
  },
  programInfo: {
    maxWidth: "18.75rem",
    ul: {
      margin: "0.5rem auto",
      listStyleType: "none",
      li: {
        wordWrap: "break-word",
        paddingTop: "0.125rem",
        paddingBottom: "0.125rem",
        whiteSpace: "break-spaces",
      },
    },
  },
};
