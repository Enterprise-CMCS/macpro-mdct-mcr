import { Button, Image, Text } from "@chakra-ui/react";
import { useMemo } from "react";
// components
import {
  EntityStatusIcon,
  generateColumns,
  SortableTable,
  MobileTable,
} from "components";
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
// types
import { EntityShape, FormJson, NaaarStandardsTableShape } from "types";
// utils
import { getStandardStatus, mapNaaarStandardsData, useBreakpoint } from "utils";

export const SortableNaaarStandardsTable = ({
  entities,
  drawerForm,
  openRowDrawer,
  openDeleteEntityModal,
}: Props) => {
  // status column is only shown when the drawer form is available to check against
  const showStatus = !!drawerForm?.fields;
  const data = useMemo(() => {
    const rows = mapNaaarStandardsData<NaaarStandardsTableShape>(entities);
    if (!showStatus) return rows;
    return rows.map((row) => ({
      ...row,
      status: getStandardStatus(row.entity, drawerForm?.fields),
    }));
  }, [entities, drawerForm]);
  const { isTablet, isMobile } = useBreakpoint();

  const customCells = (
    headKey: keyof NaaarStandardsTableShape,
    value: any,
    originalRowData: NaaarStandardsTableShape
  ) => {
    const { entity } = originalRowData;
    switch (headKey) {
      case "status":
        return <EntityStatusIcon isComplete={!!value} />;

      case "standardType":
        return <Text sx={sx.bold}>{value}</Text>;

      case "edit":
        return (
          <Button
            variant="link"
            id={value}
            name="edit"
            onClick={() => openRowDrawer(entity)}
            aria-label={`Edit standard ${originalRowData.count}`}
          >
            Edit
          </Button>
        );

      case "delete":
        return (
          <Button
            sx={sx.deleteButton}
            id={value}
            name="delete"
            onClick={() => openDeleteEntityModal(entity)}
          >
            <Image
              alt={`Delete standard ${originalRowData.count}`}
              src={deleteIcon}
              boxSize="2xl"
            />
          </Button>
        );

      default:
        return value;
    }
  };

  const sortableHeadRow = {
    ...(showStatus && { status: { header: "Status" } }),
    count: { header: "#" },
    provider: { header: "Provider" },
    standardType: { header: "Standard type" },
    description: { header: "Standard description" },
    analysisMethods: { header: "Analysis methods" },
    population: { header: "Pop." },
    region: { header: "Region" },
    edit: { header: "Edit standard", hidden: true },
    delete: { header: "Delete standard", hidden: true },
  };

  const columns = generateColumns<NaaarStandardsTableShape>(
    sortableHeadRow,
    true,
    customCells
  );

  const content = { caption: "Access and Network Adequacy Standards" };

  return isTablet || isMobile ? (
    <MobileTable columns={columns} data={data} />
  ) : (
    <SortableTable
      border={true}
      columns={columns}
      data={data}
      content={content}
    />
  );
};

interface Props {
  entities: EntityShape[];
  /**
   * Drawer form for the standards; when provided, a status column flags standards
   * that are missing required answers (e.g. required specialty details).
   */
  drawerForm?: FormJson;
  openRowDrawer: Function;
  openDeleteEntityModal: Function;
}

const sx = {
  deleteButton: {
    marginRight: "-2.5rem",
    padding: 0,
    background: "white",
    "&:hover, &:hover:disabled, :disabled": {
      background: "white",
    },
  },
  bold: {
    fontWeight: "bold",
  },
};
