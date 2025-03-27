import { MouseEventHandler, useContext, useMemo } from "react";
// components
import { Box, Button, Text } from "@chakra-ui/react";
import {
  EntityDetailsFormOverlay,
  generateColumns,
  ReportPageIntro,
  SortableTable,
  SaveReturnButton,
  BackButton,
  OverlayContext,
} from "components";
// types
import {
  EntityDetailsMultiformVerbiage,
  EntityDetailsTableContentShape,
  EntityShape,
  FormJson,
  ScreenReaderOnlyHeaderName,
} from "types";
// utils
import {
  mapNaaarStandardEntity,
  mapNaaarStandardsData,
  NaaarStandardsTableShape,
} from "components/tables/SortableNaaarStandardsTable";
import { useStore } from "utils";

export const PlanComplianceTableOverlay = ({
  closeEntityDetailsOverlay,
  disabled,
  entities,
  form,
  onChange,
  table,
  onSubmit,
  selectedEntity,
  submitting,
  validateOnRender,
  verbiage,
}: Props) => {
  const { selectedStandard, setSelectedStandard } = useContext(OverlayContext);
  const standardsTotalCount = entities.length;
  const exceptionsCount = useMemo(() => {
    return 0;
  }, [selectedEntity]);
  const standardsCount = useMemo(() => {
    return 0;
  }, [selectedEntity]);

  const standardKeyPrefix = "planCompliance43868_standard";

  const DetailsOverlay = () => {
    const closeEntityDetailsFormOverlay = () => {
      setSelectedStandard(null);
    };
    let headRow = [] as ScreenReaderOnlyHeaderName[];
    const bodyRows = [];
    let formJson = { ...form };

    if (selectedStandard) {
      const { count, entity } = selectedStandard;
      const { provider, standardType, description, population, region } =
        mapNaaarStandardEntity(entity);
      const headers = [
        "Count",
        "Provider type",
        "Standard type",
        "Standard description",
        "Population",
        "Analysis Methods",
        "Region",
      ];
      headRow = headers.map((hiddenName) => ({ hiddenName }));
      bodyRows.push([
        count,
        provider,
        standardType,
        description,
        population,
        region,
      ]);

      formJson = addStandardId(formJson, entity.id, standardKeyPrefix);
      // TODO: Add analysis method checkboxes
    }

    const table = {
      caption: "Standard",
      headRow,
      bodyRows,
    };

    return (
      <EntityDetailsFormOverlay
        closeEntityDetailsOverlay={closeEntityDetailsFormOverlay}
        disabled={disabled}
        form={formJson}
        onChange={onChange}
        onSubmit={onSubmit}
        selectedEntity={selectedEntity}
        submitting={submitting}
        table={table}
        validateOnRender={validateOnRender || false}
        verbiage={verbiage}
      />
    );
  };

  const TableOverlay = () => {
    const getStandardForm = (entity: EntityShape, count: number) => {
      window.scrollTo(0, 0);
      setSelectedStandard({ count, entity });
    };

    const customCells = (
      headKey: keyof NaaarStandardsTableShape,
      value: any,
      originalRowData: NaaarStandardsTableShape
    ) => {
      const { count, entity } = originalRowData;
      const hasStandardDetails = true;

      switch (headKey) {
        case "standardType": {
          return (
            <Text as="span" sx={sx.bold}>
              {value}
            </Text>
          );
        }
        case "actions": {
          return (
            <Button
              variant="outline"
              onClick={() => getStandardForm(entity, count)}
              sx={sx.tableButton}
            >
              {hasStandardDetails ? "Edit" : "Enter"}
            </Button>
          );
        }
        default:
          return value;
      }
    };

    const { caption, sortableHeadRow, verbiage: tableVerbiage } = table;
    const columns = generateColumns(sortableHeadRow, false, customCells);
    const content = { caption };

    const { report } = useStore();
    const analysisMethods = report?.fieldData["analysisMethods"] || [];

    const analysisMethodsUsedByPlan = analysisMethods
      .filter((method: EntityShape) => {
        const plansUsingMethod =
          method.analysis_method_applicable_plans?.filter((plan: EntityShape) =>
            plan.key.endsWith(selectedEntity?.id)
          ) || [];
        if (plansUsingMethod.length > 0) {
          return method;
        }

        return;
      })
      .map((method: EntityShape) => method.id);

    // Filter standards to only those with analysis methods used by plan
    const standards = entities.filter((standard: EntityShape) => {
      const key =
        Object.keys(standard).find((key) =>
          key.startsWith("standard_analysisMethodsUtilized")
        ) || "";
      const standardAnalysisMethods = standard[key].map((method: EntityShape) =>
        method.key.split("-").pop()
      );
      const usedMethod = standardAnalysisMethods.some((method: string) =>
        analysisMethodsUsedByPlan.includes(method)
      );

      if (usedMethod) {
        return standard;
      }

      return;
    });

    const data = useMemo(() => mapNaaarStandardsData(standards), [standards]);
    const displayCount = (label?: string, count: number = 0) =>
      label && `${label}: ${count} of ${standardsTotalCount}`;

    return (
      <Box sx={sx.container}>
        <BackButton
          onClick={closeEntityDetailsOverlay}
          text={tableVerbiage.backButton}
        />
        <ReportPageIntro
          text={tableVerbiage.intro}
          accordion={tableVerbiage.accordion}
          sxOverride={sxOverride}
        />
        <Box sx={sx.counts}>
          <Text sx={sx.count}>
            {displayCount(tableVerbiage.totals?.exceptions, exceptionsCount)}
          </Text>
          <Text sx={sx.count}>
            {displayCount(tableVerbiage.totals?.standards, standardsCount)}
          </Text>
        </Box>
        <Box sx={sx.tableContainer}>
          <SortableTable
            border={true}
            columns={columns}
            content={content}
            data={data}
          />
          <SaveReturnButton
            border={false}
            onClick={closeEntityDetailsOverlay}
            submitting={submitting}
          />
        </Box>
      </Box>
    );
  };

  return selectedStandard ? <DetailsOverlay /> : <TableOverlay />;
};

export const addStandardId = (
  formJson: FormJson,
  uuid: string,
  prefix: string
) => {
  function traverse(obj: any) {
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        obj[index] = traverse(item);
      });
    } else if (obj !== null && typeof obj === "object") {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];

        if (typeof value === "string" && value.startsWith(prefix)) {
          const option = value.includes("-")
            ? value.split("-").pop()
            : undefined;
          obj[key] = [prefix, uuid, option].filter((f) => f).join("-");
        }
        obj[key] = traverse(obj[key]);
      });
    }

    return obj;
  }

  return traverse(formJson);
};

interface Props {
  closeEntityDetailsOverlay: MouseEventHandler;
  disabled: boolean;
  entities: EntityShape[];
  form: FormJson;
  onChange?: Function;
  onSubmit: Function;
  selectedEntity?: EntityShape;
  submitting: boolean;
  table: EntityDetailsTableContentShape;
  validateOnRender?: boolean;
  verbiage: EntityDetailsMultiformVerbiage;
}

const sx = {
  container: {
    maxWidth: "fit-content",
  },
  counts: {
    marginBottom: "2rem",
  },
  count: {
    color: "palette.gray_medium",
    fontWeight: "bold",
  },
  tableContainer: {
    maxWidth: "53rem",
    width: "fit-content",
  },
  tableButton: {
    marginX: "1rem",
    width: "6rem",
  },
  bold: {
    fontWeight: "bold",
  },
};

const sxOverride = {
  table: {
    th: {
      borderBottomWidth: 0,
    },
    tbody: {
      backgroundColor: "palette.secondary_lightest",
    },
  },
};
