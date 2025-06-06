import { Button, Image, Text } from "@chakra-ui/react";
import { useMemo } from "react";
// components
import { generateColumns, SortableTable, MobileTable } from "components";
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
// types
import { EntityShape, NaaarStandardsTableShape } from "types";
// utils
import { mapNaaarStandardsData, useBreakpoint } from "utils";

export const SortableNaaarStandardsTable = ({
  entities,
  openRowDrawer,
  openDeleteEntityModal,
}: Props) => {
  const data = useMemo(
    () => mapNaaarStandardsData<NaaarStandardsTableShape>(entities),
    [entities]
  );
  const { isTablet, isMobile } = useBreakpoint();

  const customCells = (
    headKey: keyof NaaarStandardsTableShape,
    value: any,
    originalRowData: NaaarStandardsTableShape
  ) => {
    const { entity } = originalRowData;
    switch (headKey) {
      case "standardType": {
        return <Text sx={sx.bold}>{value}</Text>;
      }
      case "edit": {
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
      }
      case "delete": {
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
      }
      default:
        return value;
    }
  };

  const sortableHeadRow = {
    count: { header: "#" },
    provider: { header: "Provider" },
    standardType: { header: "Standard Type" },
    description: { header: "Standard Description" },
    analysisMethods: { header: "Analysis Methods" },
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
