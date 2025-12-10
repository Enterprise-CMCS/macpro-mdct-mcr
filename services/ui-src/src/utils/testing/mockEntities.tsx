import React from "react";
import { Text } from "@chakra-ui/react";
import { EntityShape } from "types";

export const mockAccessMeasuresEntity = {
  id: "mock-access-measures-id",
  accessMeasure_generalCategory: [{ value: "mock-category" }],
  accessMeasure_standardDescription: "mock-description",
  accessMeasure_standardType: [{ value: "mock-standard-type" }],
  "accessMeasure_standardType-otherText": "",
  "accessMeasure_monitoringMethods-otherText": "mock-other-text",
  accessMeasure_providerType: [{ value: "mock-provider-type" }],
  accessMeasure_applicableRegion: [{ value: "Other, specify" }],
  "accessMeasure_applicableRegion-otherText": "mock-region-other-text",
  accessMeasure_population: [{ value: "mock-population" }],
  accessMeasure_monitoringMethods: [
    { value: "mock-monitoring-method-1" },
    { value: "mock-monitoring-method-2" },
    { value: "Custom method" },
  ],
  accessMeasure_oversightMethodFrequency: [
    { value: "mock-oversight-method-frequency" },
  ],
};

export const mockUnfinishedAccessMeasuresFormattedEntityData = {
  category: "mock-category",
  standardDescription: "mock-description",
  standardType: "mock-standard-type",
};

export const mockCompletedAccessMeasuresFormattedEntityData = {
  ...mockUnfinishedAccessMeasuresFormattedEntityData,
  provider: "mock-provider-type",
  region: "mock-region-other-text",
  population: "mock-population",
  monitoringMethods: [
    "mock-monitoring-method-1",
    "mock-monitoring-method-2",
    "Custom method - mock-other-text",
  ],
  methodFrequency: "mock-oversight-method-frequency",
};

export const mockQualityMeasuresEntity = {
  id: "mock-id",
  qualityMeasure_crossProgramReportingRateProgramList: "Mock program list",
  qualityMeasure_description: "Mock description",
  qualityMeasure_domain: [
    {
      key: "qualityMeasure_domain-mock",
      value: "Mock domain",
    },
  ],
  qualityMeasure_name: "Mock name",
  qualityMeasure_nqfNumber: "12345678",
  "qualityMeasure_plan_measureResults_mock-plan-id-1": "Yes",
  "qualityMeasure_plan_measureResults_mock-plan-id-2": "Yes",
  qualityMeasure_reportingPeriod: [
    {
      key: "qualityMeasure_reportingPeriod-mock",
      value: "Mock reporting period",
    },
  ],
  qualityMeasure_reportingPeriodEndDate: "",
  qualityMeasure_reportingPeriodStartDate: "",
  qualityMeasure_reportingRateType: [
    {
      key: "qualityMeasure_reportingRateType-mock",
      value: "Cross-program rate",
    },
  ],
  qualityMeasure_set: [
    {
      key: "qualityMeasure_set-mock",
      value: "Mock Set",
    },
  ],
};

export const mockQualityMeasuresData = {
  name: "Test Measure",
  domain: "Domain",
  nqfNumber: "1234",
  reportingPeriod: "Yes",
  reportingRateType: "Rate Type",
  set: "Mock set",
  description: "Description",
};

export const mockUnfinishedQualityMeasuresFormattedEntityData = {
  perPlanResponses: [
    {
      name: "mock-plan-name-1",
      response: undefined,
    },
    {
      name: "mock-plan-name-2",
      response: undefined,
    },
  ],
  reportingPeriod: "Mock reporting period",
};

export const mockCompletedQualityMeasuresFormattedEntityData = {
  ...mockUnfinishedQualityMeasuresFormattedEntityData,
  name: "Mock name",
  description: "Mock description",
  domain: "Mock domain",
  nqfNumber: "12345678",
  perPlanResponses: [
    {
      name: "mock-plan-name-1",
      response: "Yes",
    },
    {
      name: "mock-plan-name-2",
      response: "Yes",
    },
  ],
  reportingRateType: "Cross-program rate: Mock program list",
  set: "Mock Set",
};

export const mockSanctionsEntity = {
  id: "mock-id",
  sanction_interventionType: [{ value: "MCPAR" }],
  sanction_interventionTopic: [{ value: "mock-topic" }],
  sanction_planName: { label: "sanction_planName", value: "mock-plan-id-1" },
  sanction_interventionReason: "mock-reason",
  sanction_noncomplianceInstances: "1234567",
  sanction_dollarAmount: "1234.52",
  sanction_assessmentDate: "01/01/2001",
  sanction_remediationDate: "01/01/2001",
  sanction_correctiveActionPlan: [{ value: "mock-answer" }],
};

export const mockUnfinishedSanctionsFormattedEntityData = {
  interventionType: "MCPAR",
  interventionTopic: "mock-topic",
  planName: "mock-plan-name-1",
  interventionReason: "mock-reason",
};

export const mockCompletedSanctionsFormattedEntityData = {
  ...mockUnfinishedSanctionsFormattedEntityData,
  noncomplianceInstances: "1,234,567",
  dollarAmount: "$1,234.52",
  assessmentDate: "01/01/2001",
  remediationDate: "01/01/2001",
  correctiveActionPlan: "mock-answer",
};

export const mockNaaarAnalysisMethods: EntityShape[] = [
  {
    id: "mockAnalysis1",
    name: "Mock Method 1",
    analysis_method_applicable_plans: [
      {
        key: "mock-plan-id-1",
        name: "mock-plan-1",
      },
    ],
  },
  {
    id: "mockAnalysis2",
    name: "Mock Method 2",
    analysis_method_applicable_plans: [
      {
        key: "mock-plan-id-1",
        name: "mock-plan-1",
      },
    ],
  },
];

export const mockNaaarStandards: EntityShape[] = [
  {
    id: "mockStandard",
    "standard_standardDescription-mock-plan-id-1": "Mock Description",
    "standard_analysisMethodsUtilized-mock-plan-id-1": [
      {
        key: "standard_analysisMethodsUtilized-mock-plan-id-1-mockAnalysis1",
        value: "Mock Method 1",
      },
      {
        key: "standard_analysisMethodsUtilized-mock-plan-id-1-mockAnalysis2",
        value: "Mock Method 2",
      },
    ],
    standard_coreProviderType: [
      {
        key: "standard_coreProviderType-mock-plan-id-1",
        value: "Mock Provider",
      },
    ],
    "standard_coreProviderType-mock-plan-id-1": "Mock Other Provider",
    standard_standardType: [
      { key: "mockStandardType", value: "Mock Standard Type" },
    ],
    standard_populationCoveredByStandard: [
      { key: "mockPopulation", value: "Mock Population" },
    ],
    standard_applicableRegion: [{ key: "mockRegion", value: "Other, specify" }],
    "standard_applicableRegion-otherText": "Mock Other Region",
  },
];

export const mockSanctionsFullData = {
  noncomplianceInstances: "2",
  dollarAmount: "$5,000",
  assessmentDate: "2025-05-01",
  remediationCompleted: "Yes",
  remediationDate: "2025-06-01",
  correctiveActionPlan: "Plan A",
};

export const mockSanctionsPartialData = {
  dollarAmount: "$5,000",
  assessmentDate: "2025-05-01",
  remediationCompleted: "",
  remediationDate: "",
};

export const mockFormattedEntityData = {
  provider: "Clinic, Hospital",
  analysisMethods: "Quantitative, Qualitative",
  region: "North America",
  population: "Adults",
  count: "42",
  standardType: "Clinical Standards",
  description: "A description of clinical standards used in the evaluation.",
};

export const mockNotAnswered = (
  <Text as="span" data-testid="not-answered">
    Not answered
  </Text>
);

export const mockfullAccessMeasuresData = {
  standardType: "Type A",
  standardDescription: "This is a description of the standard.",
  category: "General",
  provider: "Hospital",
  providerDetails: "Some details",
  region: "North",
  population: "Urban",
  monitoringMethods: ["Method A", "Method B"],
  methodFrequency: "Monthly",
};

export const mockPlanSectionData = {
  heading: "Mock plan non-compliance",
  questions: [
    {
      question: "The plan does not meet this standard",
      answer: "Mock expections granted under 42 C.F.R. § 438.68(d)",
    },
    {
      question: "Mock descriptions of expections granted",
      answer: ["Network adequacy standard exceptions", "State's justification"],
    },
  ],
};
