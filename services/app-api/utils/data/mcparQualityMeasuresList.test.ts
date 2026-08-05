import { State } from "../types";
import { mcparQualityMeasuresList } from "./mcparQualityMeasuresList";
import { mcparProgramList } from "../../../ui-src/src/programLists/mcparProgramList";

describe("mcparQualityMeasuresList", () => {
  const counts: { [key in State]: { [key: string]: number } } = {
    AL: {
      programs: 0,
      measures: 0,
    },
    AK: {
      programs: 0,
      measures: 0,
    },
    AZ: {
      programs: 4,
      measures: 20,
    },
    AR: {
      programs: 2,
      measures: 11,
    },
    CA: {
      programs: 6,
      measures: 60,
    },
    CO: {
      programs: 1,
      measures: 47,
    },
    CT: {
      programs: 0,
      measures: 0,
    },
    DE: {
      programs: 1,
      measures: 81,
    },
    DC: {
      programs: 3,
      measures: 34,
    },
    FL: {
      programs: 3,
      measures: 19,
    },
    GA: {
      programs: 4,
      measures: 150,
    },
    HI: {
      programs: 2,
      measures: 62,
    },
    ID: {
      programs: 4,
      measures: 11,
    },
    IL: {
      programs: 1,
      measures: 45,
    },
    IN: {
      programs: 3,
      measures: 187,
    },
    IA: {
      programs: 2,
      measures: 8,
    },
    KS: {
      programs: 1,
      measures: 38,
    },
    KY: {
      programs: 1,
      measures: 5,
    },
    LA: {
      programs: 3,
      measures: 60,
    },
    ME: {
      programs: 0,
      measures: 0,
    },
    MD: {
      programs: 1,
      measures: 35,
    },
    MA: {
      programs: 5,
      measures: 83,
    },
    MI: {
      programs: 5,
      measures: 175,
    },
    MN: {
      programs: 3,
      measures: 67,
    },
    MS: {
      programs: 1,
      measures: 29,
    },
    MO: {
      programs: 1,
      measures: 30,
    },
    MT: {
      programs: 0,
      measures: 0,
    },
    NE: {
      programs: 1,
      measures: 67,
    },
    NV: {
      programs: 2,
      measures: 34,
    },
    NH: {
      programs: 2,
      measures: 80,
    },
    NJ: {
      programs: 2,
      measures: 125,
    },
    NM: {
      programs: 1,
      measures: 21,
    },
    NY: {
      programs: 6,
      measures: 230,
    },
    NC: {
      programs: 2,
      measures: 32,
    },
    ND: {
      programs: 1,
      measures: 30,
    },
    OH: {
      programs: 4,
      measures: 124,
    },
    OK: {
      programs: 0,
      measures: 0,
    },
    OR: {
      programs: 1,
      measures: 44,
    },
    PA: {
      programs: 4,
      measures: 91,
    },
    PR: {
      programs: 1,
      measures: 43,
    },
    RI: {
      programs: 2,
      measures: 17,
    },
    SC: {
      programs: 1,
      measures: 22,
    },
    SD: {
      programs: 0,
      measures: 0,
    },
    TN: {
      programs: 1,
      measures: 38,
    },
    TX: {
      programs: 5,
      measures: 261,
    },
    UT: {
      programs: 5,
      measures: 57,
    },
    VT: {
      programs: 1,
      measures: 14,
    },
    VA: {
      programs: 3,
      measures: 47,
    },
    WA: {
      programs: 2,
      measures: 89,
    },
    WV: {
      programs: 2,
      measures: 82,
    },
    WI: {
      programs: 6,
      measures: 69,
    },
    WY: {
      programs: 1,
      measures: 32,
    },
    ZZ: {
      programs: 0,
      measures: 0,
    },
  };
  const totals = {
    states: 53,
    programs: 113,
    measures: 2906,
  };

  (Object.keys(counts) as State[]).forEach((key) => {
    const stateMeasuresData = mcparQualityMeasuresList[key];
    const stateProgramList = mcparProgramList[key].map(
      (program) => program.label
    );
    const programsWithMeasures = Object.keys(stateMeasuresData);
    const measures = Object.values(stateMeasuresData).flat();

    test(`${key} - program and measure counts are correct`, () => {
      expect(programsWithMeasures).toHaveLength(counts[key].programs);
      expect(measures).toHaveLength(counts[key].measures);
    });

    // TODO: Remove filter after clarification
    const filteredPrograms = programsWithMeasures.filter((program) => {
      return ![
        "Dental Managed Care/ Los Angeles",
        "Dental Managed Care/ Sacramento",
      ].includes(program);
    });

    filteredPrograms.forEach((programName) => {
      test(`${key} - ${programName} is in program list`, () => {
        expect(stateProgramList).toContain(programName);
      });
    });
  });

  test("Total program and measure counts are correct", () => {
    const data = mcparQualityMeasuresList;
    const states = Object.keys(data);
    const programs = Object.values(data).flatMap((stateObj) =>
      Object.keys(stateObj)
    );
    const measures = Object.values(data)
      .flatMap((stateObj) => Object.values(stateObj))
      .flat();

    expect(states).toHaveLength(totals.states);
    expect(programs).toHaveLength(totals.programs);
    expect(measures).toHaveLength(totals.measures);
  });
});
