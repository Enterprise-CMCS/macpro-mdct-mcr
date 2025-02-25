import { Button } from "@chakra-ui/react";
import {
  generateColumns,
  SortableTable,
} from "components/tables/SortableTable";
import { useMemo } from "react";

export const SortableDrawerReportPageTable = ({ entities }: Props) => {
  const actualData = useMemo(() => {
    const result = entities.map((entity: any, index: number) => {
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

    return result;
  }, [entities]);

  const customCells = (
    headKey: keyof DrawerReportPageTableShape,
    value: any
  ) => {
    switch (headKey) {
      case "edit": {
        return <Button variant="outline">Edit</Button>;
      }
      default:
        return value;
    }
  };

  const sortableHeadRow = {
    count: { header: "#" },
    provider: { header: "Provider" },
    standardType: { header: "Standard Type" },
    standardDescription: { header: "Standard Description" },
    analysisMethods: { header: "Analysis Methods" },
    population: { header: "Pop." },
    region: { header: "Region" },
    edit: { header: "" },
  };

  const columns = generateColumns<DrawerReportPageTableShape>(
    sortableHeadRow,
    true,
    customCells
  );

  const content = { caption: "caption" };

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

interface Props {
  entities: any[];
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
}
