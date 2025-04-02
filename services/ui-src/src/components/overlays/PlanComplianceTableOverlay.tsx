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
import { NaaarStandardsTableShape } from "components/tables/SortableNaaarStandardsTable";
// utils
import { planComplianceStandardKey } from "../../constants";
import {
  addAnalysisMethods,
  addStandardId,
  filteredStandards,
  hasComplianceDetails,
  mapNaaarStandardEntity,
  mapNaaarStandardsData,
} from "utils";

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
    let formJson = structuredClone(form);

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
