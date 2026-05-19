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
  MCPAR: process.env.McparReportsTable!,
  MLR: process.env.MlrReportsTable!,
  NAAAR: process.env.NaaarReportsTable!,
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

export const formTemplateTableName = process.env.FormTemplateVersionsTable!;

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

export const suppressionText = "Suppressed for data privacy purposes";

export const uuidRegex =
  /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;
