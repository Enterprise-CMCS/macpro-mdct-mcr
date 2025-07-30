import { getFormattedEntityData } from "./entities";
// constants
import { exceptionsStatus, nonComplianceStatus } from "../../constants";
// types
import { EntityType } from "types";

const mockPlanData = {
  id: "mock id",
  name: "mock plan name",
};

describe("plans", () => {
  test("Returns correct data for non-compliant plan", () => {
    const mockNonCompliantPlan = {
      ...mockPlanData,
      exceptionsNonCompliance: nonComplianceStatus,
      "mock-nonComplianceDescription": "mock description",
      "mock-nonComplianceAnalyses": [
        {
          id: "id-1",
          value: "Geomapping",
        },
        {
          id: "id-2",
          value: "Plan Provider Directory Review",
        },
        {
          id: "id-3",
          value: "mock method 3",
        },
        {
          id: "id-4",
          value: "Secret Shopper: Appointment Availability",
        },
      ],
      "mock-nonCompliancePlanToAchieveCompliance":
        "mock plan to achieve compliance",
      "mock-nonComplianceMonitoringProgress": "mock monitoring progress",
      "mock-nonComplianceReassessmentDate": "mock reassessment date",
      // geomapping
      mock_geomappingComplianceFrequency: [
        {
          value: "mock geomapping compliance frequency",
        },
      ],
      mock_geomappingComplianceFrequency_EnrolleesMeetingStandard:
        "mock geomapping enrollees meeting standard",
      mock_geomappingComplianceFrequency_q1PercentMetStandard: "mock q1 value",
      mock_geomappingComplianceFrequency_q2PercentMetStandard: "mock q2 value",
      mock_geomappingComplianceFrequency_q3PercentMetStandard: "mock q3 value",
      mock_geomappingComplianceFrequency_q4PercentMetStandard: "mock q4 value",
      // plan provider directory review
      mock_ppdrComplianceFrequency: "mock ppdr compliance frequency",
      mock_ppdrComplianceFrequency_EnrolleesMeetingStandard:
        "mock ppdr enrollees meeting standard",
      mock_ppdrComplianceFrequency_annualMinimumNumberOfNetworkProviders:
        "mock ppdr annual providers",
      mock_ppdrComplianceFrequency_annualMinimumNumberOfNetworkProvidersDate:
        "mock ppdr annual providers date",
    };

    const entityData = getFormattedEntityData(
      EntityType.PLANS,
      mockNonCompliantPlan
    );

    const expectedData = {
      heading: `Plan deficiencies for ${mockNonCompliantPlan.name}: 42 C.F.R. § 438.68`,
      questions: [
        {
          question: "Description",
          answer: "mock description",
        },
        {
          question: "Analyses used to identify deficiencies",
          answer: [
            "Geomapping",
            "Frequency of compliance findings (optional): mock geomapping compliance frequency: mock geomapping enrollees meeting standard:",
            "Q1 (optional): mock q1 value",
            "Q2 (optional): mock q2 value",
            "Q3 (optional): mock q3 value",
            "Q4 (optional): mock q4 value",
            "Plan Provider Directory Review",
            "Frequency of compliance findings (optional): mock ppdr compliance frequency: mock ppdr enrollees meeting standard:",
            "Annual (optional): mock ppdr annual providers",
            "Date of analysis of annual snapshot (optional): mock ppdr annual providers date",
            "mock method 3",
            "Secret Shopper: Appointment Availability",
            "Frequency of compliance findings (optional): Not answered, optional",
          ],
        },
        {
          question: "What the plan will do to achieve compliance",
          answer: "mock plan to achieve compliance",
        },
        {
          question: "Monitoring progress",
          answer: "mock monitoring progress",
        },
        {
          question: "Reassessment date",
          answer: "mock reassessment date",
        },
      ],
    };

    expect(entityData).toEqual(expectedData);
  });

  test("Returns correct data for plan with exception", () => {
    const mockExceptionPlan = {
      ...mockPlanData,
      exceptionsNonCompliance: exceptionsStatus,
      "mock-exceptionsDescription": "mock description",
      "mock-exceptionsJustification": "mock justification",
    };

    const entityData = getFormattedEntityData(
      EntityType.PLANS,
      mockExceptionPlan
    );

    const expectedData = {
      heading: `Exceptions granted for ${mockExceptionPlan.name} under 42 C.F.R. § 438.68(d)`,
      questions: [
        {
          question:
            "Describe any network adequacy standard exceptions that the state has granted to the plan under 42 C.F.R. § 438.68(d).",
          answer: "mock description",
        },
        {
          question:
            "Justification for exceptions granted under 42 C.F.R. § 438.68(d)",
          answer: "mock justification",
        },
      ],
    };

    expect(entityData).toEqual(expectedData);
  });
});
