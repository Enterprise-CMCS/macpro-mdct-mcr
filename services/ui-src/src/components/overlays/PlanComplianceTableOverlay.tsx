import {
  MouseEventHandler,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import { planComplianceStandardKey } from "../../constants";

export const PlanComplianceTableOverlay = ({
  analysisMethods,
  closeEntityDetailsOverlay,
  disabled,
  form,
  onChange,
  table,
  onSubmit,
  selectedEntity,
  standards,
  submitting,
  validateOnRender,
  verbiage,
}: Props) => {
  const standardKeyPrefix = planComplianceStandardKey;
  const { selectedStandard, setSelectedStandard } = useContext(OverlayContext);

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

      formJson = addStandardId(formJson, standardKeyPrefix, entity.id);
      formJson = addAnalysisMethods(formJson);
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
        sxOverride={sxOverride}
        table={table}
        validateOnRender={validateOnRender || false}
        verbiage={verbiage}
      />
    );
  };

  const TableOverlay = () => {
    const [exceptionsNonCompliance, setExceptionsNonCompliance] = useState<
      string[]
    >([]);
    const [exceptionsCount, setExceptionsCount] = useState<number>(0);
    const [nonComplianceCount, setNonComplianceCount] = useState<number>(0);
    const [standardsData, setStandardsData] = useState<EntityShape[]>([]);

    const { caption, sortableHeadRow, verbiage: tableVerbiage } = table;
    const content = { caption };

    useEffect(() => {
      const filteredData = filteredStandards(
        analysisMethods,
        standards,
        selectedEntity
      );
      setStandardsData(filteredData);
    }, [analysisMethods, standards, selectedEntity]);

    useEffect(() => {
      if (selectedEntity) {
        const updatedExceptionsNonCompliance = Object.keys(
          selectedEntity
        ).filter(
          (key) =>
            key.startsWith(`${standardKeyPrefix}-`) &&
            selectedEntity[key] !== undefined
        );
        setExceptionsNonCompliance(updatedExceptionsNonCompliance);
      }
    }, [selectedEntity, standardKeyPrefix]);

    useEffect(() => {
      const updatedExceptionsCount = exceptionsNonCompliance.filter((key) =>
        key.endsWith("exceptionsDescription")
      ).length;
      setExceptionsCount(updatedExceptionsCount);

      const updatedNonComplianceCount = exceptionsNonCompliance.filter((key) =>
        key.endsWith("nonComplianceDescription")
      ).length;

      setNonComplianceCount(updatedNonComplianceCount);
    }, [exceptionsNonCompliance]);

    const data = useMemo(
      () => mapNaaarStandardsData(standardsData),
      [standardsData]
    );
    const standardsTotalCount = data.length;

    const displayCount = (label: string = "", count: number) =>
      label && `${label}: ${count} of ${standardsTotalCount}`;

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
              {hasComplianceDetails(
                exceptionsNonCompliance,
                standardKeyPrefix,
                entity.id
              )
                ? "Edit"
                : "Enter"}
            </Button>
          );
        }
        default:
          return value;
      }
    };

    const columns = generateColumns(sortableHeadRow, false, customCells);

    return (
      <Box sx={sx.container}>
        <BackButton
          onClick={closeEntityDetailsOverlay}
          text={tableVerbiage.backButton}
        />
        <ReportPageIntro
          accordion={tableVerbiage.accordion}
          text={tableVerbiage.intro}
        />
        <Box sx={sx.counts}>
          <Text sx={sx.count}>
            {displayCount(tableVerbiage.totals?.exceptions, exceptionsCount)}
          </Text>
          <Text sx={sx.count}>
            {displayCount(tableVerbiage.totals?.standards, nonComplianceCount)}
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

export const hasComplianceDetails = (
  exceptionsNonCompliance: string[],
  standardKeyPrefix: string,
  entityId: string
) => {
  return exceptionsNonCompliance.some((key) => {
    const id = key.split(`${standardKeyPrefix}-`).pop();
    return id?.startsWith(entityId);
  });
};

export const filteredStandards = (
  analysisMethods: EntityShape[] = [],
  standards: EntityShape[] = [],
  selectedEntity?: EntityShape
) => {
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

  const filterStandards = standards.filter((standard: EntityShape) => {
    const key =
      Object.keys(standard).find((key) =>
        key.startsWith("standard_analysisMethodsUtilized")
      ) || "";

    // Collect ids of standards in standard_analysisMethodsUtilized-*
    const analysisMethodsUsedByStandard =
      standard[key]?.map((method: EntityShape) =>
        method.key.split("-").pop()
      ) || [];
    const isAnalysisMethodUsedByStandardAndPlan =
      analysisMethodsUsedByStandard.some((method: string) =>
        analysisMethodsUsedByPlan.includes(method)
      );

    if (isAnalysisMethodUsedByStandardAndPlan) return standard;
    return;
  });

  return filterStandards;
};

// TODO: Add analysis methods checkboxes used by standard
export const addAnalysisMethods = (formJson: FormJson) => {
  return formJson;
};

export const addStandardId = (
  formJson: FormJson,
  standardPrefix: string,
  standardId: string
) => {
  function traverse(obj: any) {
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        obj[index] = traverse(item);
      });
    } else if (obj !== null && typeof obj === "object") {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];

        if (typeof value === "string" && value.startsWith(standardPrefix)) {
          const option = value.includes("-")
            ? value.split("-").pop()
            : undefined;
          obj[key] = [standardPrefix, standardId, option]
            .filter((f) => f)
            .join("-");
        }
        obj[key] = traverse(obj[key]);
      });
    }

    return obj;
  }

  return traverse(formJson);
};

interface Props {
  analysisMethods: EntityShape[];
  closeEntityDetailsOverlay: MouseEventHandler;
  disabled: boolean;
  form: FormJson;
  onChange?: Function;
  onSubmit: Function;
  selectedEntity?: EntityShape;
  standards: EntityShape[];
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
