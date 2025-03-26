import React, { MouseEventHandler, useMemo, useState } from "react";
// components
import { Box, Button, Text } from "@chakra-ui/react";
import {
  EntityDetailsFormOverlay,
  generateColumns,
  ReportPageIntro,
  SortableTable,
  SaveReturnButton,
  BackButton,
} from "components";
// types
import {
  EntityDetailsMultiformVerbiage,
  EntityDetailsTableContentShape,
  EntityShape,
  FormJson,
} from "types";
// utils
import {
  naaarStandardsData,
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
  const standardsTotalCount = entities.length;
  // TODO: Set up counts
  const exceptionsCount = 0;
  const standardsCount = 0;

  const [isEntityDetailsOpen, setIsEntityDetailsOpen] =
    useState<boolean>(false);

  const DetailsOverlay = () => {
    const closeEntityDetailsFormOverlay = () => {
      setIsEntityDetailsOpen(false);
    };
    return (
      <EntityDetailsFormOverlay
        closeEntityDetailsOverlay={closeEntityDetailsFormOverlay}
        disabled={disabled}
        form={form}
        onChange={onChange}
        onSubmit={onSubmit}
        selectedEntity={selectedEntity}
        submitting={submitting}
        validateOnRender={validateOnRender || false}
        verbiage={verbiage}
      />
    );
  };

  const TableOverlay = () => {
    const customCells = (
      headKey: keyof NaaarStandardsTableShape,
      value: any
    ) => {
      switch (headKey) {
        case "actions": {
          return (
            <Button
              variant="outline"
              onClick={() => setIsEntityDetailsOpen(true)}
              sx={sx.tableButton}
            >
              Enter
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
    const data = useMemo(() => naaarStandardsData(entities), [entities]);

    return (
      <Box sx={sx.container}>
        <BackButton
          onClick={closeEntityDetailsOverlay}
          text={tableVerbiage.backButton}
        />
        <ReportPageIntro
          text={tableVerbiage.intro}
          accordion={tableVerbiage.accordion}
        />
        <Box sx={sx.counts}>
          <Text sx={sx.count}>
            {tableVerbiage.totals?.exceptions}: {exceptionsCount} of{" "}
            {standardsTotalCount}
          </Text>
          <Text sx={sx.count}>
            {tableVerbiage.totals?.standards}: {standardsCount} of{" "}
            {standardsTotalCount}
          </Text>
        </Box>
        <Box sx={sx.tableContainer}>
          <SortableTable columns={columns} content={content} data={data} />
          <SaveReturnButton submitting={submitting} />
        </Box>
      </Box>
    );
  };

  return isEntityDetailsOpen ? <DetailsOverlay /> : <TableOverlay />;
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
  overlayContainer: {
    backgroundColor: "palette.white",
    width: "100%",
  },
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
    width: "fit-content",
  },
  tableButton: {
    width: "6rem",
  },
};
