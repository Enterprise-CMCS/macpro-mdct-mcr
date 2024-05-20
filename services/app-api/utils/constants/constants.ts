export const error = {
  // generic errors
  UNAUTHORIZED: "User is not authorized to access this resource.",
  NO_KEY: "Must provide key for table.",
  MISSING_DATA: "Missing required data.",
  INVALID_DATA: "Provided data is not valid.",
  NO_MATCHING_RECORD: "No matching record found.",
  SERVER_ERROR: "An unspecified server error occured.",
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
};

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
};

export const formTemplateTableName = process.env.FORM_TEMPLATE_TABLE_NAME!;

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
    "plan_ilosUtilizationByPlan",
    `plan_ilosUtilizationByPlan-otherText_${RegExp("^.*$")}`,
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
