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
  PageTypes,
} from "types";
// utils
import {
  parseCustomHtml,
  parseFormFieldInfo,
  routeChecker,
  useStore,
} from "utils";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-export";

export const ExportedReportFieldTable = ({ section }: Props) => {
  const { report } = useStore();
  const { tableHeaders } = verbiage;

  const pageType = section.pageType;
  let formFields =
    pageType === "drawer" ? section.drawerForm?.fields : section.form?.fields;

  const renderNotReportingFields = (field: FormField | FormLayoutElement) => {
    // Always prepend the gating radio field to show it in the export
    formFields = [field, ...(formFields || [])];
  };

  // For frozen templates with page-level gating radios on drawer pages
  if (
    pageType === PageTypes.DRAWER &&
    section.form?.fields &&
    section.form.fields.length > 0 &&
    (routeChecker.isPriorAuthorizationPage(section) ||
      routeChecker.isPatientAccessApiPage(section))
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

  const shouldRenderTable =
    !(entityType === EntityType.PLANS && missingPlansOrIlos) &&
    !(entityType === EntityType.BSS_ENTITIES && !hasBss);

  const { tableRows, hasAnyNumberedRow } = shouldRenderTable
    ? renderFieldTableBody(
        formFields!,
        pageType!,
        report,
        !hideHintText,
        entityType
      )
    : { tableRows: [], hasAnyNumberedRow: false };

  const headRowItems =
    !formHasOnlyDynamicFields && hasAnyNumberedRow
      ? threeColumnHeaderItems
      : twoColumnHeaderItems;

  return (
    // if there are no plans added, render the appropriate verbiage
    <Box>
      {entityType === EntityType.PLANS && missingPlansOrIlos ? (
        <Box sx={sx.missingEntityMessage} data-testid="missingEntityMessage">
          {parseCustomHtml(renderMissingEntityVerbiage() || "")}
        </Box>
      ) : // oxlint-disable-next-line no-nested-ternary
      entityType === EntityType.BSS_ENTITIES && !hasBss ? (
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
          {tableRows}
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
  const rowDescriptors: {
    formField: FormField | FormLayoutElement;
    parentFieldCheckedChoiceIds?: string[];
  }[] = [];
  // recursively collects row descriptors (same traversal as before, just data instead of JSX)
  const renderFieldRow = (
    formField: FormField | FormLayoutElement,
    parentFieldCheckedChoiceIds?: string[]
  ) => {
    rowDescriptors.push({ formField, parentFieldCheckedChoiceIds });
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
  const hasAnyNumberedRow = rowDescriptors.some(
    ({ formField }) => !!parseFormFieldInfo(formField.props)?.number
  );

  const tableRows: ReactElement[] = rowDescriptors.map(
    ({ formField, parentFieldCheckedChoiceIds }) => (
      <ExportedReportFieldRow
        key={formField.id}
        formField={formField}
        pageType={pageType}
        entityType={entityType}
        parentFieldCheckedChoiceIds={parentFieldCheckedChoiceIds}
        showHintText={showHintText}
        hasNumberColumn={hasAnyNumberedRow}
      />
    )
  );

  return { tableRows, hasAnyNumberedRow };
};

export interface Props {
  section: StandardReportPageShape | DrawerReportPageShape;
  showHintText?: boolean;
}

export const exportTableSx = {
  "@media print": {
    pageBreakInside: "avoid",
  },
  marginBottom: "spacer2",
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
      paddingLeft: "spacer2",
    },
  },
};
