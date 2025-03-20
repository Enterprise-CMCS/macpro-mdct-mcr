import React, { MouseEventHandler, useMemo, useState } from "react";
// components
import { Box, Button, Image } from "@chakra-ui/react";
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
import { useStore } from "utils";

export const PlanComplianceTableOverlay = ({
  closeEntityDetailsOverlay,
  disabled,
  onChange,
  table,
  onSubmit,
  selectedEntity,
  submitting,
  validateOnRender,
  verbiage,
}: Props) => {
  const { report } = useStore();
  const standardEntities = report?.fieldData["standards"] || [];

  const [isEntityDetailsOpen, setIsEntityDetailsOpen] =
    useState<boolean>(false);

  const DetailsOverlay = () => {
    // TODO: Back to table
    const closeEntityDetailsFormOverlay = () => {
      return;
    };
    // TODO: Form shape
    const form = {} as FormJson;

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
    // TODO: Cells
    const customCells = (headKey: keyof SortableTableDataShape, value: any) => {
      switch (headKey) {
        case "actions": {
          setIsEntityDetailsOpen(true);
          return;
        }
        default:
          return value;
      }
    };

    const { caption, sortableHeadRow, verbiage: tableVerbiage } = table;

    const columns = generateColumns(sortableHeadRow ?? {}, false, customCells);
    const content = { caption };
    // TODO: Data
    const data = useMemo(() => [], [standardEntities]);

    return (
      <Box>
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
        <SortableTable columns={columns} content={content} data={data} />
      </Box>
    );
  };

  return isEntityDetailsOpen ? <DetailsOverlay /> : <TableOverlay />;
};

interface SortableTableDataShape {
  count: number;
  provider: string;
  standardType: string;
  description: string;
  population?: string;
  region: string;
  // Columns with buttons
  actions?: null;
}

interface Props {
  closeEntityDetailsOverlay: MouseEventHandler;
  disabled: boolean;
  form: FormJson;
  onChange?: Function;
  onSubmit: Function;
  selectedEntity?: EntityShape;
  submitting: boolean;
  table: EntityDetailsTableContentShape;
  validateOnRender?: boolean;
  verbiage: EntityDetailsMultiformVerbiage;
}

export interface PlanComplianceTableVerbiage
  extends EntityDetailsMultiformVerbiage {
  totalExceptions?: string;
  totalNonCompliant?: string;
}

const sx = {
  overlayContainer: {
    backgroundColor: "palette.white",
    width: "100%",
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
  footerBox: {
    marginTop: "2rem",
  },
  form: {
    "legend.ds-c-label": {
      color: "palette.gray",
    },
  },
  buttonFlex: {
    justifyContent: "end",
    marginY: "1.5rem",
  },
  saveButton: {
    width: "8.25rem",
  },
};
