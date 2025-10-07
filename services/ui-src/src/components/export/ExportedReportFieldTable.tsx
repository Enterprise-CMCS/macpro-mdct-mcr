import { ReactElement } from "react";
// components
import { Box } from "@chakra-ui/react";
import { ExportedReportFieldRow, Table } from "components";
// types
import {
  Choice,
  EntityShape,
  FieldChoice,
  FormField,
  StandardReportPageShape,
  DrawerReportPageShape,
  ReportShape,
  FormLayoutElement,
  isFieldElement,
  ReportType,
  EntityType,
} from "types";
// utils
import { parseCustomHtml, useStore } from "utils";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-export";

export const ExportedReportFieldTable = ({ section }: Props) => {
  const { report } = useStore();
  const { tableHeaders } = verbiage;

  const pageType = section.pageType;
  let formFields =
    pageType === "drawer" ? section.drawerForm?.fields : section.form?.fields;

  const renderNotReportingFields = (field: FormField | FormLayoutElement) => {
    formFields =
      report?.fieldData[field.id]?.value === "Yes"
        ? [field, ...(formFields || [])]
        : section.form?.fields;
  };

  if (
    pageType === "drawer" &&
    section.form &&
    (section.path === "/mcpar/plan-level-indicators/prior-authorization" ||
      section.path === "/mcpar/plan-level-indicators/patient-access-api")
  ) {
    for (let i = 0; i < section.form.fields.length; i++) {
      renderNotReportingFields(section.form.fields[i]);
    }
  }

  const entityType = section.entityType;

  const formHasOnlyDynamicFields = formFields?.every(
    (field: FormField | FormLayoutElement) => field.type === "dynamic"
  );
  const twoColumnHeaderItems = [tableHeaders.indicator, tableHeaders.response];
  const threeColumnHeaderItems = [
    tableHeaders.number,
    tableHeaders.indicator,
    tableHeaders.response,
  ];
  const headRowItems = formHasOnlyDynamicFields
    ? twoColumnHeaderItems
    : threeColumnHeaderItems;

  const reportType = report?.reportType as ReportType;
  const hideHintText = reportType === ReportType.MLR;

  const hasPlans = report?.fieldData["plans"]?.length;
  const hasIlos = report?.fieldData["ilos"]?.length;
  const hasBss = report?.fieldData["bssEntities"]?.length;

  // handle missing plans / ilos rendering logic
  const renderMissingEntityVerbiage = () => {
    const { path, verbiage: v } = section as DrawerReportPageShape;

    // verbiage for ILOS
    if (path === "/mcpar/plan-level-indicators/ilos" && !hasIlos) {
      return !hasPlans ? v.missingPlansAndIlosMessage : v.missingIlosMessage;
    }

    // verbiage for missing plans
    return !hasPlans ? v.missingEntityMessage : undefined;
  };

  const missingPlansOrIlos = !(hasIlos || hasPlans);

  return (
    // if there are no plans added, render the appropriate verbiage
    <Box>
      {entityType === EntityType.PLANS && missingPlansOrIlos ? (
        <Box sx={sx.missingEntityMessage} data-testid="missingEntityMessage">
          {parseCustomHtml(renderMissingEntityVerbiage() || "")}
        </Box>
      ) : entityType === EntityType.BSS_ENTITIES && !hasBss ? (
        // if there are no BSS entities added, render the appropriate verbiage
        <Box sx={sx.missingEntityMessage} data-testid="missingEntityMessage">
          {parseCustomHtml(
            (section as DrawerReportPageShape).verbiage.missingEntityMessage ||
              ""
          )}
        </Box>
      ) : (
        <Table
          sx={exportTableSx}
          className={formHasOnlyDynamicFields ? "two-column" : ""}
          content={{
            caption: section.name,
            headRow: headRowItems,
          }}
          data-testid="exportTable"
        >
          {renderFieldTableBody(
            formFields!,
            pageType!,
            report,
            !hideHintText,
            entityType
          )}
        </Table>
      )}
    </Box>
  );
};

export const renderFieldTableBody = (
  formFields: (FormField | FormLayoutElement)[],
  pageType: string,
  report: ReportShape | undefined,
  showHintText: boolean,
  entityType?: EntityType
) => {
  const tableRows: ReactElement[] = [];
  // recursively renders field rows
  const renderFieldRow = (
    formField: FormField | FormLayoutElement,
    parentFieldCheckedChoiceIds?: string[]
  ) => {
    tableRows.push(
      <ExportedReportFieldRow
        key={formField.id}
        formField={formField}
        pageType={pageType}
        entityType={entityType}
        parentFieldCheckedChoiceIds={parentFieldCheckedChoiceIds}
        showHintText={showHintText}
      />
    );
    // for drawer pages, render nested child field if any entity has a checked parent choice
    if (pageType === "drawer") {
      const entityData = report?.fieldData[entityType!];
      formField?.props?.choices?.forEach((choice: FieldChoice) => {
        // filter to only entities where this choice is checked
        const entitiesWithCheckedChoice = entityData?.filter(
          (entity: EntityShape) =>
            Object.keys(entity)?.find((fieldDataKey: string) => {
              const fieldDataValue = entity[fieldDataKey];
              return (
                Array.isArray(fieldDataValue) &&
                fieldDataValue.find((selectedChoice: Choice) =>
                  selectedChoice.key?.endsWith(choice.id)
                )
              );
            })
        );
        // get all checked parent field choices
        const parentFieldCheckedChoiceIds = entitiesWithCheckedChoice?.map(
          (entity: EntityShape) => entity.id
        );
        // if choice is checked in any entity, and the choice has children to display, render them
        if (
          entityType !== EntityType.ANALYSIS_METHODS &&
          entitiesWithCheckedChoice?.length > 0 &&
          choice?.children
        ) {
          choice.children?.forEach((childField: FormField) =>
            renderFieldRow(childField, parentFieldCheckedChoiceIds)
          );
        }
      });
    } else {
      // for standard pages, render nested child field if parent choice is checked
      const nestedChildren = formField?.props?.choices?.filter(
        (choice: FieldChoice) => {
          const selected = report?.fieldData[formField.id];
          const entryExists = selected?.find((selectedChoice: Choice) =>
            selectedChoice.key.endsWith(choice.id)
          );
          return entryExists && choice?.children;
        }
      );
      nestedChildren?.forEach((choice: FieldChoice) =>
        choice.children?.forEach((childField: FormField) =>
          renderFieldRow(childField)
        )
      );
    }
  };
  // map through form fields and call renderer
  formFields?.map((field: FormField | FormLayoutElement) => {
    if (isFieldElement(field)) {
      renderFieldRow(field);
    }
  });
  return tableRows;
};

export interface Props {
  section: StandardReportPageShape | DrawerReportPageShape;
  showHintText?: boolean;
}

export const exportTableSx = {
  "@media print": {
    pageBreakInside: "avoid",
  },
  marginBottom: "1rem",
  "tr, th": {
    verticalAlign: "top",
    lineHeight: "base",
    borderBottom: "1px solid",
    borderColor: "gray_lighter",
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
    color: "base",
    ".shrink &": {
      padding: "0.375rem 0rem",
    },
    ".mobile &": {
      fontSize: "xs",
    },
  },
  th: {
    paddingBottom: "0.375rem",
    fontWeight: "bold",
    lineHeight: "lg",
    color: "gray",
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
};

const sx = {
  missingEntityMessage: {
    fontWeight: "bold",
    ol: {
      paddingLeft: "1rem",
    },
  },
};
