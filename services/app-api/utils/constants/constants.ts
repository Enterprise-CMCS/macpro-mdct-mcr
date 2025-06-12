export const error = {
  // generic errors
  UNAUTHORIZED: "User is not authorized to access this resource.",
  NO_KEY: "Must provide key for table.",
  MISSING_DATA: "Missing required data.",
  INVALID_DATA: "Provided data is not valid.",
  NO_MATCHING_RECORD: "No matching record found.",
  SERVER_ERROR: "An unspecified server error occurred.",
  // bucket errors
  S3_OBJECT_CREATION_ERROR: "Report could not be created due to an S3 error.",
  S3_OBJECT_GET_ERROR: "Error while fetching report.",
  S3_OBJECT_UPDATE_ERROR: "Report could not be updated due to an S3 error.",
  // dynamo errors
  DYNAMO_CREATION_ERROR: "Report could not be created due to a database error.",
  DYNAMO_UPDATE_ERROR: "Report could not be updated due to a database error.",
  // template errors
  NO_TEMPLATE_NAME: "Must request template for download.",
  INVALID_TEMPLATE_NAME: "Requested template does not exist or does not match.",
  NOT_IN_DATABASE: "Record not found in database.",
  MISSING_FORM_TEMPLATE: "Form Template not found in S3.",
  MISSING_FIELD_DATA: "Field Data not found in S3.",
  // admin action errors
  ALREADY_ARCHIVED: "Cannot update archived report.",
  ALREADY_LOCKED: "Cannot update locked report.",
  REPORT_INCOMPLETE: "Cannot submit incomplete form.",
} as const;

export const buckets = {
  FORM_TEMPLATE: "formTemplates",
  FIELD_DATA: "fieldData",
};

// REPORTS

export const reportTables = {
  MCPAR: process.env.MCPAR_REPORT_TABLE_NAME!,
  MLR: process.env.MLR_REPORT_TABLE_NAME!,
  NAAAR: process.env.NAAAR_REPORT_TABLE_NAME!,
};

export const reportBuckets = {
  MCPAR: process.env.MCPAR_FORM_BUCKET!,
  MLR: process.env.MLR_FORM_BUCKET!,
  NAAAR: process.env.NAAAR_FORM_BUCKET!,
};

export const tableTopics = {
  MCPAR: "mcpar-reports",
  MLR: "mlr-reports",
  NAAAR: "naaar-reports",
};
export const bucketTopics = {
  MCPAR: "mcpar-form",
  MLR: "mlr-form",
  NAAAR: "naaar-form",
  MCPAR_TEMPLATE: "mcpar-form-template",
  MLR_TEMPLATE: "mlr-form-template",
  NAAAR_TEMPLATE: "naaar-form-template",
};

export const formTemplateTableName = process.env.FORM_TEMPLATE_TABLE_NAME!;

// COPY-OVER

export const McparFieldsToCopy = {
  root: [
    "state_encounterDataValidationEntity",
    "state_encounterDataValidationSystemHipaaCompliance",
    "state_encounterDataValidationEntity-otherText",
    "state_overpaymentStandard",
    "state_overpaymentStandardContractLanguageLocation",
    "state_overpaymentStandardDescription",
    "state_overpaymentReportingMonitoringEfforts",
    "state_beneficiaryCircumstanceChangeReconciliationEfforts",
    "state_providerTerminationReportingMonitoringEfforts",
    "state_providerTerminationReportingMonitoringMetrics",
    "state_providerTerminationReportingMonitoringMetricsDescription",
    "state_ownershipControlDisclosureWebsite",
    "state_ownershipControlDisclosureWebsiteLink",
    "state_timeframesForStandardPriorAuthorizationDecisions",
    "state_stateTimeframeForStandardPriorAuthorizationDecisions",
    "state_timeframesForExpeditedPriorAuthorizationDecisions",
    "state_stateTimeframeForExpeditedPriorAuthorizationDecisions",
    "program_contractTitle",
    "program_type",
    "program_type-otherText",
    "program_coveredSpecialBenefits",
    "program_coveredSpecialBenefits-otherText",
    "program_specialBenefitsAvailabilityVariation",
    "program_encounterDataUses",
    "program_encounterDataUses-otherText",
    "program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria",
    "program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria-otherText",
    "program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteriaContractLanguageLocation",
    "program_encounterDataSubmissionQualityFinancialPenaltiesContractLanguageLocation",
    "program_encounterDataQualityIncentives",
    "program_criticalIncidentDefinition",
    "program_standardAppealTimelyResolutionDefinition",
    "program_expeditedAppealTimelyResolutionDefinition",
    "program_grievanceTimelyResolutionDefinition",
    "state_bssWebsite",
    "state_bssEntityServiceAccessibility",
    "state_bssEntityLtssProgramDataIssueAssistance",
    "state_bssEntityPerformanceEvaluationMethods",
    "plan_medicalLossRatioPercentageAggregationLevel",
    "plan_medicalLossRatioPercentageAggregationLevel-otherText",
    "plan_populationSpecificMedicalLossRatioDescription",
    "plan_medicalLossRatioReportingPeriodStartDate",
    "plan_medicalLossRatioReportingPeriodEndDate",
    "program_encounterDataSubmissionTimelinessStandardDefinition",
  ],
  accessMeasures: [
    "id",
    "accessMeasure_generalCategory",
    "accessMeasure_standardDescription",
    "accessMeasure_standardType",
    "accessMeasure_standardType-otherText",
    "accessMeasure_providerType",
    "accessMeasure_providerType-otherText",
    "accessMeasure_applicableRegion",
    "accessMeasure_applicableRegion-otherText",
    "accessMeasure_population",
    "accessMeasure_population-otherText",
    "accessMeasure_monitoringMethods",
    "accessMeasure_monitoringMethods-otherText",
    "accessMeasure_oversightMethodFrequency",
    "accessMeasure_oversightMethodFrequency-otherText",
  ],
  plans: [
    "id",
    "name",
    "plan_medicalLossRatioPercentageAggregationLevel",
    "plan_medicalLossRatioPercentageAggregationLevel-otherText",
    "plan_populationSpecificMedicalLossRatioDescription",
    "plan_medicalLossRatioReportingPeriodStartDate",
    "plan_medicalLossRatioReportingPeriodEndDate",
    "program_encounterDataSubmissionTimelinessStandardDefinition",
    "plan_programIntegrityReferralPath",
    "plan_beneficiaryCircumstanceChangeReportingFrequency",
    "plan_ilosOfferedByPlan",
  ],
  qualityMeasures: [
    "id",
    "qualityMeasure_domain",
    "qualityMeasure_domain-otherText",
    "qualityMeasure_name",
    "qualityMeasure_nqfNumber",
    "qualityMeasure_reportingRateType",
    "qualityMeasure_crossProgramReportingRateProgramList",
    "qualityMeasure_set",
    "qualityMeasure_set-otherText",
    "qualityMeasure_description",
  ],
  bssEntities: [
    "id",
    "name",
    "bssEntity_entityType",
    "bssEntity_entityType-otherText",
    "bssEntity_entityRole",
    "bssEntity_entityRole-otherText",
  ],
  // sanctions are never copied from year to year.
};

export const NaaarFieldsToCopy = {
  root: [
    "contactName",
    "contactEmailAddress",
    "reportingScenario",
    "reportingScenario_significantChange",
    "reportingScenario-otherText",
    "stateName",
    "providerTypes",
  ],
  analysisMethods: [
    "id",
    "name",
    "isRequired",
    "analysis_applicable",
    "analysis_method_applicable_plans",
    "analysis_method_frequency",
    "analysis_method_frequency-otherText",
    "custom_analysis_method_name",
    "custom_analysis_method_description",
  ],
  plans: ["id", "name"],
  standards: [
    "id",
    // analysis methods utilized per standard type
    "standard_analysisMethodsUtilized-kIrheUXLpOwF7OEypso8Ylhs", // pragma: allowlist secret
    "standard_analysisMethodsUtilized-SDrVTHVxFa2YKrlBYjcqavbN", // pragma: allowlist secret
    "standard_analysisMethodsUtilized-fFSst8ncbSukHlX66fqV0udO", // pragma: allowlist secret
    "standard_analysisMethodsUtilized-tcIQ324hNsgHwHteoDgfCh08", // pragma: allowlist secret
    "standard_analysisMethodsUtilized-lG0CeH7LIO5iGxjpaKE8v37C", // pragma: allowlist secret
    "standard_analysisMethodsUtilized-EuccyPRHBiaTVhF1HMHnkUcR", // pragma: allowlist secret
    "standard_analysisMethodsUtilized-vGdzNKCsiudeNeUJZgU5qhdz", // pragma: allowlist secret
    "standard_analysisMethodsUtilized-hdz3tEHdEBvRIIdgaovgEjaa", // pragma: allowlist secret
    "standard_analysisMethodsUtilized-9eion8H8PNrCP0AeiikpsKbx", // pragma: allowlist secret
    "standard_analysisMethodsUtilized-Uil8wXl6t3aBsI4W8pQZlO5P", // pragma: allowlist secret
    // standard description per standard type
    "standard_standardDescription-kIrheUXLpOwF7OEypso8Ylhs", // pragma: allowlist secret
    "standard_standardDescription-SDrVTHVxFa2YKrlBYjcqavbN", // pragma: allowlist secret
    "standard_standardDescription-fFSst8ncbSukHlX66fqV0udO", // pragma: allowlist secret
    "standard_standardDescription-tcIQ324hNsgHwHteoDgfCh08", // pragma: allowlist secret
    "standard_standardDescription-lG0CeH7LIO5iGxjpaKE8v37C", // pragma: allowlist secret
    "standard_standardDescription-EuccyPRHBiaTVhF1HMHnkUcR", // pragma: allowlist secret
    "standard_standardDescription-vGdzNKCsiudeNeUJZgU5qhdz", // pragma: allowlist secret
    "standard_standardDescription-hdz3tEHdEBvRIIdgaovgEjaa", // pragma: allowlist secret
    "standard_standardDescription-9eion8H8PNrCP0AeiikpsKbx", // pragma: allowlist secret
    "standard_standardDescription-Uil8wXl6t3aBsI4W8pQZlO5P", // pragma: allowlist secret
    // core provider type details per provider type
    "standard_coreProviderType_details-UZK4hxPVnuYGcIgNzYFHCk", // pragma: allowlist secret
    "standard_coreProviderType_details-uITThePQiXntwGGViPTD62", // pragma: allowlist secret
    "standard_coreProviderType_details-9kBoKCLD1dYizieU5psnJi", // pragma: allowlist secret
    "standard_coreProviderType_details-kV7553HIWXekySIFLiMXLW", // pragma: allowlist secret
    "standard_coreProviderType_details-nzmRTbJeqBCoAabR4oHrrh", // pragma: allowlist secret
    "standard_coreProviderType_details-cb4y58UmsRXVITpWL7l9up", // pragma: allowlist secret
    "standard_coreProviderType_details-tlzAMYfH4I7iIl5pjqAm7R", // pragma: allowlist secret
    "standard_coreProviderType_details-WrMpSdivds4c0XfN2RPlRd", // pragma: allowlist secret
    "standard_coreProviderType_details-qbR8X0YAh8vObedJPx6QTJ", // pragma: allowlist secret
    // non-duplicated fields
    "standard_applicableRegion",
    "standard_applicableRegion-otherText",
    "standard_coreProviderType",
    "standard_populationCoveredByStandard",
    "standard_populationCoveredByStandard-otherText",
    "standard_standardType",
    "standard_standardType-otherText",
  ],
};

// ANALYSIS METHODS (NAAAR)
export const DEFAULT_ANALYSIS_METHODS = [
  "Geomapping",
  "Plan Provider Directory Review",
  "Secret Shopper: Network Participation",
  "Secret Shopper: Appointment Availability",
  "Electronic Visit Verification Data Analysis",
  "Review of Grievances Related to Access",
  "Encounter Data Analysis",
];
