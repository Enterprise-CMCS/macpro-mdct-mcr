import { Button, Image } from "@chakra-ui/react";
import { useMemo } from "react";
// components
import { generateColumns, SortableTable } from "components";
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
import { EntityShape } from "types";

export const SortableNaaarStandardsTable = ({ entities }: Props) => {
  const actualData = useMemo(() => {
    return entities.map((entity: any, index: number) => {
      const {
        standard_coreProviderTypeCoveredByStandard,
        standard_standardType,
        standard_standardDescription,
        standard_analysisMethodsUtilized,
        standard_populationCoveredByStandard,
        standard_applicableRegion,
      } = entity;

      const coreProviderType = entity[
        "standard_coreProviderTypeCoveredByStandard-otherText"
      ]
        ? `${standard_coreProviderTypeCoveredByStandard[0].value}; ${entity["standard_coreProviderTypeCoveredByStandard-otherText"]}`
        : standard_coreProviderTypeCoveredByStandard[0].value;

      const standardType =
        standard_standardType[0].value === "Other, specify"
          ? entity["standard_standardType-otherText"]
          : standard_standardType[0].value;

      const standardPopulation =
        standard_populationCoveredByStandard[0].value === "Other, specify"
          ? entity["standard_populationCoveredByStandard-otherText"]
          : standard_populationCoveredByStandard[0].value;

      const standardRegion =
        standard_applicableRegion[0].value === "Other, specify"
          ? entity["standard_applicableRegion-otherText"]
          : standard_applicableRegion[0].value;

      // there are 7 analysis methods checkboxes
      function extractMethods(
        standard_analysisMethodsUtilized: { value: any }[]
      ) {
        return standard_analysisMethodsUtilized
          ?.map((method) => method.value)
          .join(", ");
      }

      return {
        count: index + 1,
        provider: coreProviderType,
        standardType: standardType,
        standardDescription: standard_standardDescription,
        analysisMethods: extractMethods(standard_analysisMethodsUtilized),
        population: standardPopulation,
        region: standardRegion,
      };
    });
  }, [entities]);

  const customCells = (
    headKey: keyof DrawerReportPageTableShape,
    value: any
  ) => {
    switch (headKey) {
      case "edit": {
        return (
          <Button variant="link" id={value}>
            Edit
          </Button>
        );
      }
      case "delete": {
        return (
          <Button sx={sx.deleteButton} id={value}>
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
    provider: {
      header: "Provider",
    },
    standardType: {
      header: "Standard Type",
    },
    standardDescription: {
      header: "Standard Description",
    },
    analysisMethods: {
      header: "Analysis Methods",
    },
    population: {
      header: "Pop.",
    },
    region: { header: "Region" },
    edit: { header: "Edit standard", hidden: true },
    delete: { header: "Delete standard", hidden: true },
  };

  const columns = generateColumns<DrawerReportPageTableShape>(
    sortableHeadRow,
    true,
    customCells
  );

  const content = { caption: "Access and Network Adequacy Standards" };

  return (
    <SortableTable
      border={true}
      columns={columns}
      data={actualData}
      content={content}
      initialSorting={[{ id: "provider", desc: false }]}
    />
  );
};

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
}

interface DrawerReportPageTableShape {
  count: number;
  provider: number;
  standardType: string;
  description: string;
  analysisMethods: string;
  population: string;
  region: string;
  edit?: null;
  delete?: null;
}
