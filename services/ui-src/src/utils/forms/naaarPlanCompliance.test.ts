// constants
import { exceptionsStatus, nonComplianceStatus } from "../../constants";
// types
import { NaaarStandardsTableShape } from "components/tables/SortableNaaarStandardsTable";
import { FormJson } from "types";
// utils
import {
  addExceptionsNonComplianceStatus,
  addStandardId,
  exceptionsNonComplianceStatus,
  hasComplianceDetails,
} from "utils";

global.structuredClone = (val: any) => JSON.parse(JSON.stringify(val));

describe("utils/forms/naaarPlanCompliance", () => {
  describe("hasComplianceDetails()", () => {
    const exceptionsNonCompliance = [
      "mockPrefix-mockEntityId1-nonComplianceDescription",
    ];
    const standardPrefix = "mockPrefix";

    test("returns true", () => {
      expect(
        hasComplianceDetails(
          exceptionsNonCompliance,
          standardPrefix,
          "mockEntityId1"
        )
      ).toBe(true);
    });

    test("returns false", () => {
      expect(
        hasComplianceDetails(
          exceptionsNonCompliance,
          standardPrefix,
          "mockEntityId2"
        )
      ).toBe(false);
    });
  });

  describe("addStandardId()", () => {
    const standardPrefix = "mockPrefix";
    const standardId = "mockId";

    test("adds id to key", () => {
      const formJson = { id: "mockPrefix" } as FormJson;
      const newFormJson = { id: "mockPrefix-mockId" } as FormJson;

      expect(addStandardId(formJson, standardPrefix, standardId)).toEqual(
        newFormJson
      );
    });

    test("adds id to key in nested objects", () => {
      const formJson = {
        id: "mockPrefix-something",
        fields: [{ id: "mockPrefix-something", type: "mock" }],
        options: { test: 0 },
      } as FormJson;

      const newFormJson = {
        id: "mockPrefix-mockId-something",
        fields: [{ id: "mockPrefix-mockId-something", type: "mock" }],
        options: { test: 0 },
      } as FormJson;

      expect(addStandardId(formJson, standardPrefix, standardId)).toEqual(
        newFormJson
      );
    });
  });

  describe("exceptionsNonComplianceStatus()", () => {
    const exceptions = ["mockPrefix-mockEntityId1-exceptionsDescription"];
    const standardPrefix = "mockPrefix";

    test("returns exceptionsStatus", () => {
      expect(
        exceptionsNonComplianceStatus(
          exceptions,
          standardPrefix,
          "mockEntityId1"
        )
      ).toBe(exceptionsStatus);
    });

    test("returns nonComplianceStatus", () => {
      const nonCompliance = [
        "mockPrefix-mockEntityId2-nonComplianceDescription",
      ];
      expect(
        exceptionsNonComplianceStatus(
          nonCompliance,
          standardPrefix,
          "mockEntityId2"
        )
      ).toBe(nonComplianceStatus);
    });

    test("returns undefined", () => {
      expect(
        exceptionsNonComplianceStatus(
          exceptions,
          standardPrefix,
          "mockEntityId2"
        )
      ).toBeUndefined();
    });
  });

  describe("addExceptionsNonComplianceStatus()", () => {
    const entities = [
      {
        entity: {
          id: "mockEntityId1",
          "mockPrefix-mockEntityId1-nonComplianceDescription": "Mock Value",
        },
      },
      {
        entity: {
          id: "mockEntityId2",
          "mockPrefix-mockEntityId2-exceptionsDescription": "Mock Value",
        },
      },
      { entity: { id: "mockEntityId3" } },
    ] as NaaarStandardsTableShape[];

    const exceptionsNonCompliance = [
      "mockPrefix-mockEntityId1-nonComplianceDescription",
      "mockPrefix-mockEntityId2-exceptionsDescription",
    ];

    const standardPrefix = "mockPrefix";

    const expectedEntities = [
      {
        entity: {
          id: "mockEntityId1",
          "mockPrefix-mockEntityId1-nonComplianceDescription": "Mock Value",
        },
        exceptionsNonCompliance: nonComplianceStatus,
      },
      {
        entity: {
          id: "mockEntityId2",
          "mockPrefix-mockEntityId2-exceptionsDescription": "Mock Value",
        },
        exceptionsNonCompliance: exceptionsStatus,
      },
      { entity: { id: "mockEntityId3" } },
    ];

    test("adds exceptionsNonCompliance to data objects", () => {
      expect(
        addExceptionsNonComplianceStatus(
          entities,
          exceptionsNonCompliance,
          standardPrefix
        )
      ).toEqual(expectedEntities);
    });
  });
});
