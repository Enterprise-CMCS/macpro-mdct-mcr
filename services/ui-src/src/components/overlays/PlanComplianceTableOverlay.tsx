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

  const DetailsOverlay = () => {
    const closeEntityDetailsFormOverlay = () => {
      setSelectedStandard(null);
    };
    let headRow = [] as ScreenReaderOnlyHeaderName[];
    const bodyRows = [];
    let formJson = { ...form };

    function addStandardId(json: any, uuid: string) {
      function traverse(formJson: any) {
        if (Array.isArray(formJson)) {
          formJson.forEach((item, index) => {
            formJson[index] = traverse(item);
          });
        } else if (formJson !== null && typeof formJson === "object") {
          Object.keys(formJson).forEach((key) => {
            const parentKey = "planCompliance43868_standard";
            const value = formJson[key];

            if (typeof value === "string" && value.startsWith(parentKey)) {
              const option = value.includes("-")
                ? value.split("-").pop()
                : undefined;
              formJson[key] = [parentKey, uuid, option]
                .filter((o) => o)
                .join("-");
            }
            formJson[key] = traverse(formJson[key]);
          });
        }

        return formJson;
      }

      return traverse(json);
    }

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

      formJson = addStandardId(formJson, entity.id);
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
    const getStandardForm = (entity: any, count: number) => {
      window.scrollTo(0, 0);
      setSelectedStandard({ count, entity });
    };

    const customCells = (
      headKey: keyof NaaarStandardsTableShape,
      value: any,
      originalRowData: NaaarStandardsTableShape
    ) => {
      const { count, entity } = originalRowData;
      // TODO: Check if planCompliance43868_standar-{{UUID}} keys exist
      function hasDetails() {
        return false;
      }

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
              {hasDetails() ? "Edit" : "Enter"}
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
    const data = useMemo(() => mapNaaarStandardsData(entities), [entities]);
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
