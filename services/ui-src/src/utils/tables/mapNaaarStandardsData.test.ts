import { mapNaaarStandardsData } from "./mapNaaarStandardsData";
// types
import { EntityShape } from "types";
// utils
import { mockNaaarStandards } from "utils/testing/setupJest";

describe("mapNaaarStandardsData()", () => {
  test("returns correct data shape", () => {
    const tableData = mapNaaarStandardsData<any>(mockNaaarStandards);
    const expectedData = [
      {
        count: 1,
        provider: "Mock Provider; Mock Other Provider",
        standardType: "Mock Standard Type",
        description: "Mock Description",
        analysisMethods: "Mock Method 1, Mock Method 2",
        population: "Mock Population",
        region: "Mock Other Region",
        entity: mockNaaarStandards[0],
      },
    ];

    expect(tableData).toEqual(expectedData);
  });

  test("omits undefined properties", () => {
    const incompleteData: EntityShape[] = [
      {
        id: "mockStandard",
        standard_coreProviderType: [
          { key: "mockProviderType", value: "Mock Provider" },
        ],
        standard_standardType: [
          { key: "mockStandardType", value: "Mock Standard Type" },
        ],
        standard_populationCoveredByStandard: [
          { key: "mockPopulation", value: "Mock Population" },
        ],
      },
    ];
    const tableData = mapNaaarStandardsData<any>(incompleteData);
    const expectedData = [
      {
        count: 1,
        provider: "Mock Provider",
        standardType: "Mock Standard Type",
        population: "Mock Population",
        entity: incompleteData[0],
      },
    ];

    expect(tableData).toEqual(expectedData);
  });
});
