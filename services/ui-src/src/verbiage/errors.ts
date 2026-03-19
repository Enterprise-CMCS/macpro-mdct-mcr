export const genericErrorContent = [
  {
    type: "span",
    content:
      "Something went wrong on our end. Refresh your screen and try again.<br/>If this persists, contact the MDCT Help Desk with questions or to request technical assistance by emailing ",
  },
  {
    type: "externalLink",
    content: "mdct_help@cms.hhs.gov",
    props: {
      href: "mailto:mdct_help@cms.hhs.gov",
      target: "_blank",
      color: "black",
      fontWeight: "bold",
    },
  },
  {
    type: "span",
    content: ".",
  },
];

export const bannerErrors = {
  GET_BANNER_FAILED: {
    title: "Banner could not be fetched",
    description: genericErrorContent,
  },
  REPLACE_BANNER_FAILED: {
    title: "Current banner could not be replaced.",
    description: genericErrorContent,
  },
  DELETE_BANNER_FAILED: {
    title: "Current banner could not be deleted",
    description: genericErrorContent,
  },
  CREATE_BANNER_FAILED: {
    title: "Could not create a banner.",
    description: genericErrorContent,
  },
};

export const validationErrors = {
  REQUIRED_GENERIC: "A response is required",
  REQUIRED_CHECKBOX: "Select at least one response",
  REQUIRED_ONE_CHECKBOX: "Select only one response",
  INVALID_GENERIC: "Response must be valid",
  INVALID_EMAIL: "Response must be a valid email address",
  INVALID_URL: "Response must be a valid hyperlink/URL",
  INVALID_URL_OR_NR: 'Response must be a valid hyperlink/URL or "NR"',
  INVALID_DATE: "Response must be a valid date",
  INVALID_DATE_MONTH_YEAR: "Response must be in the format MM/YYYY",
  INVALID_END_DATE: "End date can't be before start date",
  INVALID_FUTURE_DATE: "Response must be today's date or in the future",
  NUMBER_LESS_THAN_ONE: "Response must be greater than or equal to one",
  NUMBER_LESS_THAN_ZERO: "Response must be greater than or equal to zero",
  INVALID_NUMBER: "Response must be a valid number",
  INVALID_NUMBER_OR_NA: 'Response must be a valid number, "N/A" or "NR"',
  INVALID_RATIO: "Response must be a valid ratio",
};

export const reportErrors = {
  GET_REPORT_DATA_FAILED: {
    title: "Unable to fetch Report Data.",
    description: genericErrorContent,
  },
  SET_REPORT_DATA_FAILED: {
    title: "Report data could not be saved.",
    description: genericErrorContent,
  },
  GET_REPORT_FAILED: {
    title: "Report could not be loaded",
    description: genericErrorContent,
  },
  GET_REPORTS_BY_STATE_FAILED: {
    title: "Reports could not be loaded",
    description: genericErrorContent,
  },
  SET_REPORT_FAILED: {
    title: "Report could not be updated",
    description: genericErrorContent,
  },
  DELETE_REPORT_FAILED: {
    title: "Report could not be deleted",
    description: genericErrorContent,
  },
};

export const analysisMethodError = {
  title: "You must have at least one analysis method used by a program.",
  description:
    "To correct this, select “Edit” and respond with “Yes” to at least one analysis method.",
};

export const loginError = {
  title: "There was an issue logging in.",
  description: "Verify credentials and try again or contact support.",
};
