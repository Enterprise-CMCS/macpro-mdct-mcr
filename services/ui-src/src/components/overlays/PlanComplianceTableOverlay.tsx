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
  MobileTable,
} from "components";
// types
import {
  EntityDetailsMultiformVerbiage,
  EntityDetailsTableContentShape,
  EntityShape,
  FormJson,
  NaaarStandardsTableShape,
  ScreenReaderCustomHeaderName,
  ReportShape,
} from "types";
// utils
import {
  exceptionsNonComplianceStatusDisplay,
  planComplianceStandardKey,
} from "../../constants";
import {
  addAnalysisMethods,
  addExceptionsNonComplianceStatus,
  addStandardId,
  getExceptionsNonComplianceCounts,
  getExceptionsNonComplianceKeys,
  hasComplianceDetails,
  mapNaaarStandardEntity,
  mapNaaarStandardsData,
  useBreakpoint,
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
  const { isTablet, isMobile } = useBreakpoint();

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
        entity,
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
    const [exceptionsNonCompliance, setExceptionsNonCompliance] = useState<
      string[]
    >([]);
    const [exceptionsCount, setExceptionsCount] = useState<number>(0);
    const [nonComplianceCount, setNonComplianceCount] = useState<number>(0);

    const { caption, sortableHeadRow, verbiage: tableVerbiage } = table;
    const content = { caption };

    useEffect(() => {
      if (selectedEntity) {
        setExceptionsNonCompliance(
          getExceptionsNonComplianceKeys(selectedEntity)
        );
      }
    }, [selectedEntity]);

    useEffect(() => {
      const {
        exceptionsCount: updatedExceptionsCount,
        nonComplianceCount: updatedNonComplianceCount,
      } = getExceptionsNonComplianceCounts(exceptionsNonCompliance);

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

    const displayCount = (label: string = "", count: number) =>
      `${label} ${count} of ${standardsTotalCount}`;

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
          <Text sx={sx.count}>
            {displayCount(
              tableVerbiage.totals?.nonCompliant,
              nonComplianceCount
            )}
          </Text>
          <Text sx={sx.count}>
            {displayCount(tableVerbiage.totals?.exceptions, exceptionsCount)}
          </Text>
        </Box>
        <Box sx={sx.tableContainer}>
          {isTablet || isMobile ? (
            <MobileTable columns={columns} data={data} />
          ) : (
            <SortableTable
              border={true}
              columns={columns}
              content={content}
              data={data}
            />
          )}
          <SaveReturnButton
            border={false}
            onClick={closeEntityDetailsOverlay}
            submitting={submitting}
            disabledOnClick={closeEntityDetailsOverlay}
          />
        </Box>
      </Box>
    );
  };

  return selectedStandard ? <DetailsOverlay /> : <TableOverlay />;
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
    color: "gray",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    ".tablet &, .mobile &": {
      whiteSpace: "normal",
    },
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
    color: "primary_darker",
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
      backgroundColor: "secondary_lightest",
    },
  },
};
