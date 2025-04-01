import { Button, Image } from "@chakra-ui/react";
import { useMemo } from "react";
// components
import { generateColumns, SortableTable } from "components";
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
import { EntityShape } from "types";
import { compareText, otherSpecify } from "utils";

export const SortableNaaarStandardsTable = ({
  entities,
  openRowDrawer,
  openDeleteEntityModal,
}: Props) => {
  const data = useMemo(() => mapNaaarStandardsData(entities), [entities]);

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

export const mapNaaarStandardEntity = (entity: EntityShape, index?: number) => {
  const [provider, standardType, population, region] = [
    "standard_coreProviderTypeCoveredByStandard",
    "standard_standardType",
    "standard_populationCoveredByStandard",
    "standard_applicableRegion",
  ].map((key: string) => {
    const parentObj = entity[key] || [];
    const value = parentObj[0]?.value;
    let otherText = entity[`${key}-otherText`];

    if (key === "standard_coreProviderTypeCoveredByStandard") {
      const providerKey = parentObj[0].key;
      const providerId = providerKey
        .split("standard_coreProviderTypeCoveredByStandard-")
        .pop();
      otherText = entity[`${key}-${providerId}-otherText`];

      const matchText = `${value}; ${otherText}`;

      return compareText(true, !!otherText, matchText, value);
    }

    return otherSpecify(value, otherText);
  });

  // extract the standard description attribute
  const standardDescriptionKey =
    Object.keys(entity).find((key) => {
      return key.startsWith("standard_standardDescription-");
    }) || "";
  const description = entity[standardDescriptionKey];
  // extract corresponding standard choice id
  const standardId = standardDescriptionKey
    .split("standard_standardDescription-")
    .pop();
  // use the id to extract analysis method attribute
  const analysisMethodsUtilized =
    entity[`standard_analysisMethodsUtilized-${standardId}`];
  // there are 7 analysis methods checkboxes
  const analysisMethods = analysisMethodsUtilized
    ?.map((method: { key: string; value: string }) => method.value)
    .join(", ");

  return {
    count: index === undefined ? undefined : index + 1,
    provider,
    standardType,
    description,
    analysisMethods,
    population,
    region,
    entity,
  };
};

export const mapNaaarStandardsData = (entities: EntityShape[]) =>
  entities.map((entity, index) => mapNaaarStandardEntity(entity, index));

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

interface Props {
  entities: EntityShape[];
  openRowDrawer: Function;
  openDeleteEntityModal: Function;
}

export interface NaaarStandardsTableShape {
  count: number;
  provider: number;
  standardType: string;
  description: string;
  analysisMethods: string;
  population: string;
  region: string;
  entity: EntityShape;
  edit?: null;
  delete?: null;
  actions?: null;
}
