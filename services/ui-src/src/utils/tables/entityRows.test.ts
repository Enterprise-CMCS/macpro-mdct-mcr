// components
import {
  buildDrawerReportPageEntityRows,
  calculateIsEntityCompleted,
  getButtonProps,
  getCompleteText,
  getEligibilityGroup,
  getIncompleteText,
  getMeasureIdDisplayText,
  getMeasureIdentifier,
  getMeasureValues,
  getProgramInfo,
  getReportingPeriodText,
  hasEntityNameWithDescription,
} from "./entityRows";
// types
import {
  EntityShape,
  ModalOverlayReportPageShape,
  ReportShape,
  ReportType,
} from "types";
// utils
import {
  mockDrawerForm,
  mockMcparReport,
  mockModalDrawerReportPageJson,
  mockModalOverlayReportPageJson,
  mockNaaarAnalysisMethodsPageJson,
} from "utils/testing/setupJest";

describe("buildDrawerReportPageEntityRows()", () => {
  const baseBuildDrawerReportPageEntityRowsProps = {
    hasForm: true,
    patientAccessDisabled: true,
    priorAuthDisabled: true,
    report: mockMcparReport,
    userIsEndUser: true,
  };

  test("returns rows", () => {
    const props = {
      ...baseBuildDrawerReportPageEntityRowsProps,
      entities: [
        {
          id: "mock-id",
          name: "Mock name",
        },
      ],
      hasForm: false,
      route: mockModalDrawerReportPageJson as any,
    };
    const input = buildDrawerReportPageEntityRows(props);
    const expectedResult = [
      {
        canAddEntities: false,
        completeText: "Status: Incomplete",
        descriptionText: undefined,
        enterButton: {
          ariaLabel: "Enter Mock name",
          buttonText: "Enter",
          disabled: false,
        },
        entity: {
          id: "mock-id",
          name: "Mock name",
        },
        entityName: "Mock name",
        hasEntityNameWithDescription: false,
        incompleteText: "Select “Enter” to complete response.",
        isEntityCompleted: false,
        showCompletionIcon: false,
      },
    ];
    expect(input).toEqual(expectedResult);
  });

  test("returns empty rows for no entities", () => {
    const props = {
      ...baseBuildDrawerReportPageEntityRowsProps,
      entities: [],
      route: mockModalOverlayReportPageJson,
    };
    const input = buildDrawerReportPageEntityRows(props);
    const expectedResult: any[] = [];
    expect(input).toEqual(expectedResult);
  });

  test("returns empty rows for no form", () => {
    const props = {
      ...baseBuildDrawerReportPageEntityRowsProps,
      entities: [
        {
          id: "mock-id",
          name: "Mock name",
        },
      ],
      route: mockModalOverlayReportPageJson,
    };
    const input = buildDrawerReportPageEntityRows(props);
    const expectedResult: any[] = [];
    expect(input).toEqual(expectedResult);
  });

  test("returns rows for analysis methods", () => {
    const props = {
      ...baseBuildDrawerReportPageEntityRowsProps,
      entities: [
        {
          id: "mock-id",
          name: "Mock name",
        },
      ],
      route: mockNaaarAnalysisMethodsPageJson,
    };
    const input = buildDrawerReportPageEntityRows(props);
    const expectedResult = [
      {
        canAddEntities: true,
        completeText: "Not utilized",
        descriptionText: undefined,
        enterButton: {
          ariaLabel: "Enter Mock name",
          buttonText: "Enter",
          disabled: false,
        },
        entity: {
          id: "mock-id",
          name: "Mock name",
        },
        entityName: "Mock name",
        hasEntityNameWithDescription: false,
        incompleteText: "Select “Enter” to complete response.",
        isEntityCompleted: false,
        showCompletionIcon: true,
      },
    ];
    expect(input).toEqual(expectedResult);
  });

  test("returns rows for custom analysis methods", () => {
    const props = {
      ...baseBuildDrawerReportPageEntityRowsProps,
      entities: [
        {
          id: "mock-id",
          custom_analysis_method_description:
            "Mock analysis method description",
          custom_analysis_method_name: "Mock analysis method name",
        },
      ],
      route: mockNaaarAnalysisMethodsPageJson,
    };
    const input = buildDrawerReportPageEntityRows(props);
    const expectedResult = [
      {
        canAddEntities: true,
        completeText: "Not utilized",
        descriptionText: "Mock analysis method description",
        enterButton: {
          ariaLabel: "Enter Mock analysis method name",
          buttonText: "Enter",
          disabled: false,
        },
        entity: {
          id: "mock-id",
          custom_analysis_method_description:
            "Mock analysis method description",
          custom_analysis_method_name: "Mock analysis method name",
        },
        entityName: "Mock analysis method name",
        hasEntityNameWithDescription: false,
        incompleteText: "Select “Enter” to complete response.",
        isEntityCompleted: false,
        showCompletionIcon: true,
      },
    ];
    expect(input).toEqual(expectedResult);
  });
});

describe("calculateIsEntityCompleted()", () => {
  const incompleteEntity = {
    id: "mock-plan-id-1",
    name: "mock-plan-name-1",
  };

  const completeEntity = {
    ...incompleteEntity,
    "mock-drawer-text-field": "example-explanation",
    plan_ilosOfferedByPlan: [
      {
        key: "mock-key",
        value: "Yes",
      },
    ],
    plan_ilosUtilizationByPlan: [
      {
        id: "mock-ilos",
        name: "ilos",
      },
    ],
  };

  const baseCalculateIsEntityCompletedProps = {
    addEntityForm: mockDrawerForm,
    entity: completeEntity,
    form: mockDrawerForm,
    isCustomEntity: false,
    reportingOnIlos: false,
  };

  test("returns true for complete entity", () => {
    const input = calculateIsEntityCompleted(
      baseCalculateIsEntityCompletedProps
    );
    expect(input).toBe(true);
  });

  test("returns false for incomplete entity", () => {
    const props = {
      ...baseCalculateIsEntityCompletedProps,
      entity: incompleteEntity,
    };
    const input = calculateIsEntityCompleted(props);
    expect(input).toBe(false);
  });

  test("returns true for custom entity", () => {
    const props = {
      ...baseCalculateIsEntityCompletedProps,
      isCustomEntity: true,
    };
    const input = calculateIsEntityCompleted(props);
    expect(input).toBe(true);
  });

  test("returns false for custom entity", () => {
    const props = {
      ...baseCalculateIsEntityCompletedProps,
      entity: incompleteEntity,
      isCustomEntity: true,
    };
    const input = calculateIsEntityCompleted(props);
    expect(input).toBe(false);
  });

  test("returns true for ilos", () => {
    const props = {
      ...baseCalculateIsEntityCompletedProps,
      reportingOnIlos: true,
    };
    const input = calculateIsEntityCompleted(props);
    expect(input).toBe(true);
  });

  test("returns false for ilos", () => {
    const props = {
      ...baseCalculateIsEntityCompletedProps,
      entity: incompleteEntity,
      reportingOnIlos: true,
    };
    const input = calculateIsEntityCompleted(props);
    expect(input).toBe(false);
  });
});

describe("getButtonProps()", () => {
  const baseButtonProps = {
    entityName: "Mock button",
    isAnalysisMethodsPage: false,
    isEntityCompleted: false,
    patientAccessDisabled: false,
    priorAuthDisabled: false,
    route: {} as ModalOverlayReportPageShape,
    report: {} as ReportShape,
    userIsEndUser: true,
  };

  describe("state user", () => {
    test("returns Enter button", () => {
      const input = getButtonProps(baseButtonProps);
      const expectedResult = {
        ariaLabel: "Enter Mock button",
        buttonText: "Enter",
        disabled: false,
      };
      expect(input).toEqual(expectedResult);
    });

    test("returns Edit button", () => {
      const props = {
        ...baseButtonProps,
        isEntityCompleted: true,
      };
      const input = getButtonProps(props);
      const expectedResult = {
        ariaLabel: "Edit Mock button",
        buttonText: "Edit",
        disabled: false,
      };
      expect(input).toEqual(expectedResult);
    });

    test("returns enabled button for ilos", () => {
      const props = {
        ...baseButtonProps,
        route: {
          path: "/mcpar/plan-level-indicators/ilos",
        } as ModalOverlayReportPageShape,
        report: mockMcparReport,
      };
      const input = getButtonProps(props);
      const expectedResult = {
        ariaLabel: "Enter Mock button",
        buttonText: "Enter",
        disabled: false,
      };
      expect(input).toEqual(expectedResult);
    });

    test("returns disabled button for ilos", () => {
      const props = {
        ...baseButtonProps,
        route: {
          path: "/mcpar/plan-level-indicators/ilos",
        } as ModalOverlayReportPageShape,
        report: {} as ReportShape,
      };
      const input = getButtonProps(props);
      const expectedResult = {
        ariaLabel: "Enter Mock button",
        buttonText: "Enter",
        disabled: true,
      };
      expect(input).toEqual(expectedResult);
    });

    test("returns disabled button for prior authorization", () => {
      const props = {
        ...baseButtonProps,
        priorAuthDisabled: true,
        route: {
          path: "/mcpar/plan-level-indicators/prior-authorization",
        } as ModalOverlayReportPageShape,
      };
      const input = getButtonProps(props);
      const expectedResult = {
        ariaLabel: "Enter Mock button",
        buttonText: "Enter",
        disabled: true,
      };
      expect(input).toEqual(expectedResult);
    });

    test("returns disabled button for patient accesss api", () => {
      const props = {
        ...baseButtonProps,
        patientAccessDisabled: true,
        route: {
          path: "/mcpar/plan-level-indicators/patient-access-api",
        } as ModalOverlayReportPageShape,
      };
      const input = getButtonProps(props);
      const expectedResult = {
        ariaLabel: "Enter Mock button",
        buttonText: "Enter",
        disabled: true,
      };
      expect(input).toEqual(expectedResult);
    });

    test("returns enabled button for analysis methods", () => {
      const props = {
        ...baseButtonProps,
        isAnalysisMethodsPage: true,
        report: mockMcparReport,
      };
      const input = getButtonProps(props);
      const expectedResult = {
        ariaLabel: "Enter Mock button",
        buttonText: "Enter",
        disabled: false,
      };
      expect(input).toEqual(expectedResult);
    });

    test("returns disabled button for analysis methods", () => {
      const props = {
        ...baseButtonProps,
        isAnalysisMethodsPage: true,
      };
      const input = getButtonProps(props);
      const expectedResult = {
        ariaLabel: "Enter Mock button",
        buttonText: "Enter",
        disabled: true,
      };
      expect(input).toEqual(expectedResult);
    });
  });

  describe("admin user", () => {
    test("returns View button", () => {
      const props = {
        ...baseButtonProps,
        userIsEndUser: false,
      };
      const input = getButtonProps(props);
      const expectedResult = {
        ariaLabel: "View Mock button",
        buttonText: "View",
        disabled: false,
      };
      expect(input).toEqual(expectedResult);
    });
  });
});

describe("getCompleteText()", () => {
  describe("analysis methods", () => {
    const baseGetCompleteTextProps = {
      isAnalysisMethodsPage: true,
      isCustomEntity: false,
      isEntityCompleted: true,
    };

    test("returns frequency for applicable method", () => {
      const props = {
        ...baseGetCompleteTextProps,
        entity: {
          id: "mock-entity",
          analysis_applicable: [
            {
              key: "analysis_applicable",
              value: "Yes",
            },
          ],
          analysis_method_frequency: [
            {
              key: "analysis_method_frequency",
              value: "Weekly",
            },
          ],
          analysis_method_applicable_plans: [
            {
              key: "mock-id-1",
              value: "Plan 1",
            },
            {
              key: "mock-id-2",
              value: "Plan 2",
            },
          ],
        } as EntityShape,
      };
      const input = getCompleteText(props);
      expect(input).toBe("Weekly: Plan 1, Plan 2");
    });

    test("returns frequency for custom entity", () => {
      const props = {
        ...baseGetCompleteTextProps,
        entity: {
          id: "mock-entity",
          analysis_method_frequency: [
            {
              key: "analysis_method_frequency",
              value: "Monthly",
            },
          ],
          analysis_method_applicable_plans: [
            {
              key: "mock-id-1",
              value: "Plan 1",
            },
            {
              key: "mock-id-2",
              value: "Plan 2",
            },
          ],
        } as EntityShape,
        isCustomEntity: true,
      };
      const input = getCompleteText(props);
      expect(input).toBe("Monthly: Plan 1, Plan 2");
    });

    test("returns not utilized for not applicable", () => {
      const props = {
        ...baseGetCompleteTextProps,
        entity: {
          id: "mock-entity",
          analysis_applicable: [
            {
              key: "analysis_applicable",
              value: "No",
            },
          ],
        } as EntityShape,
      };
      const input = getCompleteText(props);
      expect(input).toBe("Not utilized");
    });

    test("returns not utilized for no plans", () => {
      const props = {
        ...baseGetCompleteTextProps,
        entity: {
          id: "mock-entity",
          analysis_applicable: [
            {
              key: "analysis_applicable",
              value: "Yes",
            },
          ],
        } as EntityShape,
      };
      const input = getCompleteText(props);
      expect(input).toBe("Not utilized");
    });
  });

  test("returns undefined for complete entity", () => {
    const props = {
      entity: {
        id: "mock-entity",
      } as EntityShape,
      isAnalysisMethodsPage: false,
      isCustomEntity: false,
      isEntityCompleted: true,
    };
    const input = getCompleteText(props);
    expect(input).toBe(undefined);
  });

  test("returns incomplete status", () => {
    const props = {
      entity: {
        id: "mock-entity",
      } as EntityShape,
      isAnalysisMethodsPage: false,
      isCustomEntity: false,
      isEntityCompleted: false,
    };
    const input = getCompleteText(props);
    expect(input).toBe("Status: Incomplete");
  });
});

describe("getIncompleteText()", () => {
  test("returns text for incomplete", () => {
    expect(getIncompleteText({ isEntityCompleted: false })).toBe(
      "Select “Enter” to complete response."
    );
  });

  test("returns undefined for complete", () => {
    expect(getIncompleteText({ isEntityCompleted: true })).toBe(undefined);
  });
});

describe("getEligibilityGroup()", () => {
  const baseEntity = {
    id: "mock-report",
    report_eligibilityGroup: [
      {
        key: "report_eligibilityGroup",
        value: "Mock eligibility group",
      },
    ],
  };

  test("returns group name", () => {
    const input = getEligibilityGroup(baseEntity);
    expect(input).toBe("Mock eligibility group");
  });

  test("returns other text", () => {
    const otherTextEntity = {
      ...baseEntity,
      "report_eligibilityGroup-otherText": "Mock eligibility group text",
    };
    const input = getEligibilityGroup(otherTextEntity);
    expect(input).toBe("Mock eligibility group text");
  });
});

describe("getReportingPeriodText()", () => {
  test("returns reporting period", () => {
    const entity = {
      id: "mock-report",
      report_reportingPeriodStartDate: "01/01/2021",
      report_reportingPeriodEndDate: "01/01/2022",
    };

    const input = getReportingPeriodText(entity);
    expect(input).toBe("01/01/2021 to 01/01/2022");
  });
});

describe("getProgramInfo()", () => {
  const baseEntity = {
    id: "mock-report",
    report_eligibilityGroup: [
      {
        key: "report_eligibilityGroup",
        value: "Mock eligibility group",
      },
    ],
    report_planName: "Mock plan name",
    report_programName: "Mock program name",
    report_reportingPeriodStartDate: "01/01/2021",
    report_reportingPeriodEndDate: "01/01/2022",
  };

  test("returns string array", () => {
    const input = getProgramInfo(baseEntity);
    const expectedResult: string[] = [
      "Mock plan name",
      "Mock program name",
      "Mock eligibility group",
      "01/01/2021 to 01/01/2022",
    ];
    expect(input).toEqual(expectedResult);
  });

  test("returns string array with other text", () => {
    const otherTextEntity = {
      ...baseEntity,
      "report_eligibilityGroup-otherText": "Mock eligibility group text",
    };
    const input = getProgramInfo(otherTextEntity);
    const expectedResult: string[] = [
      "Mock plan name",
      "Mock program name",
      "Mock eligibility group text",
      "01/01/2021 to 01/01/2022",
    ];
    expect(input).toEqual(expectedResult);
  });
});

describe("getMeasureIdentifier()", () => {
  test("returns CBE", () => {
    const entity = {
      id: "mock-report",
      measure_identifierCbe: "1234",
    };
    const input = getMeasureIdentifier(entity);
    expect(input).toBe("CBE: 1234");
  });

  test("returns CMIT", () => {
    const entity = {
      id: "mock-report",
      measure_identifierCmit: "1234",
    };
    const input = getMeasureIdentifier(entity);
    expect(input).toBe("CMIT: 1234");
  });
});

describe("getMeasureIdDisplayText()", () => {
  test("returns N/A", () => {
    const entity = {
      id: "mock-report",
    };
    const input = getMeasureIdDisplayText(entity);
    expect(input).toBe("Measure ID: N/A");
  });

  test("returns ID", () => {
    const entity = {
      id: "mock-report",
      measure_identifierCbe: "1234",
    };
    const input = getMeasureIdDisplayText(entity);
    expect(input).toBe("Measure ID: CBE: 1234");
  });
});

describe("getMeasureValues()", () => {
  test("returns values for string value", () => {
    const entity = {
      id: "mock-report",
      mock: "mock value",
    };
    const input = getMeasureValues(entity, "mock");
    expect(input).toEqual(["mock value"]);
  });

  test("returns values for array value", () => {
    const entity = {
      id: "mock-report",
      mock: [
        {
          key: "mock",
          value: "mock array value",
        },
      ],
    };
    const input = getMeasureValues(entity, "mock");
    expect(input).toEqual(["mock array value"]);
  });

  test("returns values for measure identifier", () => {
    const entity = {
      id: "mock-report",
      measure_identifier: [
        {
          key: "measure_identifier-mock",
          value: "cbe",
        },
      ],
      measure_identifierCbe: "1234",
    };
    const input = getMeasureValues(entity, "measure_identifier");
    expect(input).toEqual(["CBE: 1234"]);
  });

  test("returns values for other measure identifier", () => {
    const entity = {
      id: "mock-report",
      measure_identifier: [
        {
          key: "measure_identifier-mock",
          value: "other",
        },
      ],
      measure_identifierDefinition: "mock definition",
    };
    const input = getMeasureValues(entity, "measure_identifier");
    const expectedResult: string[] = ["Other definition: mock definition"];
    expect(input).toEqual(expectedResult);
  });

  test("returns values for other measure identifier with domains and url", () => {
    const entity = {
      id: "mock-report",
      measure_identifier: [
        {
          key: "measure_identifier-mock",
          value: "other",
        },
      ],
      measure_identifierDefinition: "mock definition",
      measure_identifierDomain: [
        {
          key: "measure_identifierDomain-mock",
          value: "mock domain",
        },
      ],
      measure_identifierUrl: "https://mock",
    };
    const input = getMeasureValues(entity, "measure_identifier");
    const expectedResult: string[] = [
      "Other definition: mock definition",
      "Link: https://mock",
      "Measure domain(s): mock domain",
    ];
    expect(input).toEqual(expectedResult);
  });
});

describe("hasEntityNameWithDescription()", () => {
  test("returns false for MCPAR", () => {
    expect(hasEntityNameWithDescription(ReportType.MCPAR)).toBe(false);
  });

  test("returns true for MLR", () => {
    expect(hasEntityNameWithDescription(ReportType.MLR)).toBe(true);
  });

  test("returns true for NAAAR", () => {
    expect(hasEntityNameWithDescription(ReportType.NAAAR)).toBe(true);
  });
});
