import { EntityShape } from "types";

export const mockAccessMeasuresEntity = {
  id: "mock-access-measures-id",
  accessMeasure_generalCategory: [{ value: "mock-category" }],
  accessMeasure_standardDescription: "mock-description",
  accessMeasure_standardType: [{ value: "mock-standard-type" }],
  "accessMeasure_standardType-otherText": "",
  accessMeasure_providerType: [{ value: "mock-provider-type" }],
  accessMeasure_applicableRegion: [{ value: "Other, specify" }],
  "accessMeasure_applicableRegion-otherText": "mock-region-other-text",
  accessMeasure_population: [{ value: "mock-population" }],
  accessMeasure_monitoringMethods: [
    { value: "mock-monitoring-method-1" },
    { value: "mock-monitoring-method-2" },
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
  monitoringMethods: ["mock-monitoring-method-1", "mock-monitoring-method-2"],
  methodFrequency: "mock-oversight-method-frequency",
};

export const mockQualityMeasuresEntity = {
  id: "ad3126-7225-17a8-628f-821857076e",
  qualityMeasure_domain: [
    {
      key: "qualityMeasure_domain-id",
      value: "Primary care access and preventative care",
    },
  ],
  qualityMeasure_name: "Measure Name",
  qualityMeasure_nqfNumber: "1234",
  qualityMeasure_reportingRateType: [
    {
      key: "qualityMeasure_reportingRateType-id",
      value: "Program-specific rate",
    },
  ],
  qualityMeasure_set: [
    {
      key: "qualityMeasure_set-id",
      value: "Medicaid Child Core Set",
    },
  ],
  qualityMeasure_reportingPeriod: [
    {
      key: "qualityMeasure_reportingPeriod-id",
      value: "Yes",
    },
  ],
  qualityMeasure_description: "Measure Description",
};

export const mockUnfinishedQualityMeasuresFormattedEntityData = {
  domain: "Primary care access and preventative care",
  name: "Measure Name",
  nqfNumber: "1234",
  reportingRateType: "Program-specific rate",
  set: "Medicaid Child Core Set",
  reportingPeriod: "Yes",
  description: "Measure Description",
  perPlanResponses: [
    { name: "mock-plan-name-1", response: undefined },
    { name: "mock-plan-name-2", response: undefined },
  ],
};

export const mockQualityMeasuresEntityMissingReportingPeriodAndDetails = {
  ...mockQualityMeasuresEntity,
  qualityMeasure_reportingPeriod: undefined,
  "qualityMeasure_plan_measureResults_mock-plan-id-1": "mock-response-1",
};

export const mockQualityMeasuresFormattedEntityDataMissingReportingPeriodAndDetails =
  {
    ...mockUnfinishedQualityMeasuresFormattedEntityData,
    reportingPeriod: undefined,
    perPlanResponses: [
      { name: "mock-plan-name-1", response: "mock-response-1" },
      { name: "mock-plan-name-2", response: undefined },
    ],
  };

export const mockQualityMeasuresEntityMissingReportingPeriod = {
  ...mockQualityMeasuresEntity,
  qualityMeasure_reportingPeriod: undefined,
  "qualityMeasure_plan_measureResults_mock-plan-id-1": "mock-response-1",
  "qualityMeasure_plan_measureResults_mock-plan-id-2": "mock-response-2",
};

export const mockQualityMeasuresFormattedEntityDataMissingReportingPeriod = {
  ...mockUnfinishedQualityMeasuresFormattedEntityData,
  reportingPeriod: undefined,
  perPlanResponses: [
    { name: "mock-plan-name-1", response: "mock-response-1" },
    { name: "mock-plan-name-2", response: "mock-response-2" },
  ],
};

export const mockQualityMeasuresEntityMissingDetails = {
  ...mockQualityMeasuresEntity,
  "qualityMeasure_plan_measureResults_mock-plan-id-1": "mock-response-1",
};

export const mockQualityMeasuresFormattedEntityDataMissingDetails = {
  ...mockUnfinishedQualityMeasuresFormattedEntityData,
  perPlanResponses: [
    { name: "mock-plan-name-1", response: "mock-response-1" },
    { name: "mock-plan-name-2", response: undefined },
  ],
};

export const mockCompletedQualityMeasuresEntity = {
  ...mockQualityMeasuresEntity,
  "qualityMeasure_plan_measureResults_mock-plan-id-1": "mock-response-1",
  "qualityMeasure_plan_measureResults_mock-plan-id-2": "mock-response-2",
};

export const mockCompletedQualityMeasuresFormattedEntityData = {
  ...mockUnfinishedQualityMeasuresFormattedEntityData,
  perPlanResponses: [
    { name: "mock-plan-name-1", response: "mock-response-1" },
    { name: "mock-plan-name-2", response: "mock-response-2" },
  ],
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
