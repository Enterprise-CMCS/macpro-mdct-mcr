import { Button, Image } from "@chakra-ui/react";
import { useMemo } from "react";
// components
import { generateColumns, SortableTable } from "components";
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
// types
import { EntityShape } from "types";
// utils
import { mapNaaarStandardsData } from "utils";

export const SortableNaaarStandardsTable = ({
  entities,
  openRowDrawer,
  openDeleteEntityModal,
}: Props) => {
  const data = useMemo(
    () => mapNaaarStandardsData<NaaarStandardsTableShape>(entities),
    [entities]
  );

  const customCells = (
    headKey: keyof NaaarStandardsTableShape,
    value: any,
    originalRowData: NaaarStandardsTableShape
  ) => {
    const { entity } = originalRowData;
    switch (headKey) {
      case "edit": {
        return (
          <Button
            variant="link"
            id={value}
            name="edit"
            onClick={() => openRowDrawer(entity)}
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
            <Image src={deleteIcon} alt="delete" boxSize="2xl" />
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

  return (
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

export interface NaaarStandardsTableShape {
  id: string;
  count: number;
  provider: string;
  standardType: string;
  description: string;
  analysisMethods: string;
  population: string;
  region: string;
  entity: EntityShape;
  exceptionsNonCompliance?: string;
  edit?: null;
  delete?: null;
  actions?: null;
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
};
