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

export const mockHalfCompletedQualityMeasuresEntity = {
  ...mockQualityMeasuresEntity,
  "qualityMeasure_plan_measureResults_mock-plan-id-1": "mock-response-1",
};

export const mockHalfCompletedQualityMeasuresFormattedEntityData = {
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
  sanction_noncomplianceInstances: "mock-instances",
  sanction_dollarAmount: "mock-dollar-amount",
  sanction_assessmentDate: "mock-date",
  sanction_remediationDate: "mock-date",
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
  noncomplianceInstances: "mock-instances",
  dollarAmount: "mock-dollar-amount",
  assessmentDate: "mock-date",
  remediationDate: "mock-date",
  correctiveActionPlan: "mock-answer",
};
