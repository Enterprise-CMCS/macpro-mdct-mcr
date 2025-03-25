import React, { MouseEventHandler, useMemo, useState } from "react";
// components
import { Box, Button, Image, Text } from "@chakra-ui/react";
import {
  EntityDetailsFormOverlay,
  generateColumns,
  ReportPageIntro,
  SortableTable,
} from "components";
// types
import {
  EntityDetailsMultiformVerbiage,
  EntityDetailsTableContentShape,
  EntityShape,
  FormJson,
} from "types";
// assets
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";
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
        <Button
          sx={sx.backButton}
          variant="none"
          onClick={closeEntityDetailsOverlay}
          aria-label={tableVerbiage.backButton}
        >
          <Image src={arrowLeftBlue} alt="Arrow left" sx={sx.backIcon} />
          {tableVerbiage.backButton}
        </Button>
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
        <SortableTable columns={columns} content={content} data={data} />
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
  backButton: {
    padding: 0,
    fontWeight: "normal",
    color: "palette.primary",
    display: "flex",
    position: "relative",
    right: "3rem",
    marginBottom: "2rem",
    marginTop: "-2rem",
  },
  backIcon: {
    color: "palette.primary",
    height: "1rem",
    marginRight: "0.5rem",
  },
  counts: {
    marginBottom: "2rem",
  },
  count: {
    color: "palette.gray_medium",
    fontWeight: "bold",
  },
};
