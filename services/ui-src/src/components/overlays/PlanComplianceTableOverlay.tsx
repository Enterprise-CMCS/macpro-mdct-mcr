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
  ScreenReaderCustomHeaderName,
  ReportShape,
  AnyObject,
} from "types";
import { NaaarStandardsTableShape } from "components/tables/SortableNaaarStandardsTable";
// utils
import {
  exceptionsNonComplianceStatusDisplay,
  planComplianceStandardKey,
} from "../../constants";
import {
  addAnalysisMethods,
  addExceptionsNonComplianceStatus,
  addStandardId,
  hasComplianceDetails,
  mapNaaarStandardEntity,
  mapNaaarStandardsData,
} from "utils";

export const PlanComplianceTableOverlay = ({
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
  report,
}: Props) => {
  const standardKeyPrefix = planComplianceStandardKey;
  const { selectedStandard, setSelectedStandard } = useContext(OverlayContext);

  const DetailsOverlay = () => {
    const closeEntityDetailsFormOverlay = () => {
      setSelectedStandard(null);
    };
    let headRow = [] as ScreenReaderCustomHeaderName[];
    const bodyRows = [];
    let formJson = structuredClone(form);

    if (selectedStandard) {
      const { count, entity } = selectedStandard;
      const { provider, standardType, description, population, region } =
        mapNaaarStandardEntity<NaaarStandardsTableShape>(entity);
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
        `${count}`,
        provider,
        standardType,
        description,
        population,
        region,
      ]);
      formJson = addStandardId(formJson, standardKeyPrefix, entity.id);
      formJson = addAnalysisMethods(
        formJson,
        standardKeyPrefix,
        entity.id,
        standards,
        report?.fieldData.analysisMethods,
        selectedEntity?.name
      );
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
    const { caption, sortableHeadRow, verbiage: tableVerbiage } = table;
    const content = { caption };

    const {
      exceptionsCountDisplayText,
      nonComplianceCountDisplayText,
      exceptionsNonCompliance,
      data,
    } = getCounts(selectedEntity, standardKeyPrefix, standards, tableVerbiage);

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
        case "exceptionsNonCompliance": {
          return value ? (
            <Text as="span" sx={sx.exceptionsNonCompliance} aria-label={value}>
              {exceptionsNonComplianceStatusDisplay[value]}
            </Text>
          ) : null;
        }
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
          <Text sx={sx.count}>{exceptionsCountDisplayText}</Text>
          <Text sx={sx.count}>{nonComplianceCountDisplayText}</Text>
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

export const getCounts = (
  selectedEntity: EntityShape | undefined,
  standardKeyPrefix: string,
  standards: EntityShape[],
  tableVerbiage: AnyObject
) => {
  const [exceptionsNonCompliance, setExceptionsNonCompliance] = useState<
    string[]
  >([]);
  const [exceptionsCount, setExceptionsCount] = useState<number>(0);
  const [nonComplianceCount, setNonComplianceCount] = useState<number>(0);

  useEffect(() => {
    if (selectedEntity) {
      const updatedExceptionsNonCompliance = Object.keys(selectedEntity).filter(
        (key) =>
          key.startsWith(`${standardKeyPrefix}-`) &&
          selectedEntity[key] !== undefined
      );
      setExceptionsNonCompliance(updatedExceptionsNonCompliance);
    }
  }, [selectedEntity, standardKeyPrefix]);

  useEffect(() => {
    const { updatedExceptionsCount, updatedNonComplianceCount } =
      exceptionsNonCompliance.reduce(
        (obj, key) => {
          if (key.endsWith("exceptionsDescription")) {
            obj.updatedExceptionsCount++;
          } else if (key.endsWith("nonComplianceDescription")) {
            obj.updatedNonComplianceCount++;
          }
          return obj;
        },
        { updatedExceptionsCount: 0, updatedNonComplianceCount: 0 }
      );

    setExceptionsCount(updatedExceptionsCount);
    setNonComplianceCount(updatedNonComplianceCount);
  }, [exceptionsNonCompliance]);

  const data = useMemo(
    () =>
      addExceptionsNonComplianceStatus(
        mapNaaarStandardsData<NaaarStandardsTableShape>(standards),
        exceptionsNonCompliance,
        standardKeyPrefix
      ),
    [exceptionsNonCompliance, standardKeyPrefix, standards]
  );
  const standardsTotalCount = data.length;

  const displayCount = (label: string = "Total", count: number) =>
    `${label}: ${count} of ${standardsTotalCount}`;

  return {
    exceptionsCountDisplayText: displayCount(
      tableVerbiage.totals?.exceptions,
      exceptionsCount
    ),
    nonComplianceCountDisplayText: displayCount(
      tableVerbiage.totals?.standards,
      nonComplianceCount
    ),
    exceptionsNonCompliance,
    data,
  };
};

interface Props {
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
  report?: ReportShape;
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
  exceptionsNonCompliance: {
    color: "palette.primary_darker",
    fontWeight: "bold",
    textAlign: "center",
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
