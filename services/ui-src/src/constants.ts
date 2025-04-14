import { AnyObject } from "types";

// HOST DOMAIN
export const PRODUCTION_HOST_DOMAIN = "mdctmcr.cms.gov";

// FIELDS
export const dropdownDefaultOptionText = "- Select an option -";
export const dropdownNoReports = "No reports eligible for copy";

export const closeText = "Close";
export const saveAndCloseText = "Save & close";
export const drawerReminderText =
  "Complete all fields and select the Save & close button to save this section.";

// STATES
export enum States {
  AL = "Alabama",
  AK = "Alaska",
  AS = "American Samoa",
  AZ = "Arizona",
  AR = "Arkansas",
  CA = "California",
  CO = "Colorado",
  CT = "Connecticut",
  DE = "Delaware",
  DC = "District of Columbia",
  FM = "Federated States of Micronesia",
  FL = "Florida",
  GA = "Georgia",
  GU = "Guam",
  HI = "Hawaii",
  ID = "Idaho",
  IL = "Illinois",
  IN = "Indiana",
  IA = "Iowa",
  KS = "Kansas",
  KY = "Kentucky",
  LA = "Louisiana",
  ME = "Maine",
  MH = "Marshall Islands",
  MD = "Maryland",
  MA = "Massachusetts",
  MI = "Michigan",
  MN = "Minnesota",
  MS = "Mississippi",
  MO = "Missouri",
  MT = "Montana",
  NE = "Nebraska",
  NV = "Nevada",
  NH = "New Hampshire",
  NJ = "New Jersey",
  NM = "New Mexico",
  NY = "New York",
  NC = "North Carolina",
  ND = "North Dakota",
  MP = "Northern Mariana Islands",
  OH = "Ohio",
  OK = "Oklahoma",
  OR = "Oregon",
  PW = "Palau",
  PA = "Pennsylvania",
  PR = "Puerto Rico",
  RI = "Rhode Island",
  SC = "South Carolina",
  SD = "South Dakota",
  TN = "Tennessee",
  TX = "Texas",
  UT = "Utah",
  VT = "Vermont",
  VI = "Virgin Islands",
  VA = "Virginia",
  WA = "Washington",
  WV = "West Virginia",
  WI = "Wisconsin",
  WY = "Wyoming",
}

// ILOS
export const PLAN_ILOS = [
  {
    id: "k9t7YoOeTOAXX3s7qF6XfN44",
    name: "ilos",
    isRequired: true,
  },
];

// ANALYSIS METHODS (NAAAR)
export const DEFAULT_ANALYSIS_METHODS = [
  {
    id: "k9t7YoOeTOAXX3s7qF6XfN33",
    name: "Geomapping",
    isRequired: true,
  },
  {
    id: "rklEpKXz8jDefWdCtzI7c7oQ",
    name: "Plan Provider Directory Review",
    isRequired: true,
  },
  {
    id: "lWbEf22iUIwylv0D8f73LvNK",
    name: "Secret Shopper: Network Participation",
    isRequired: true,
  },
  {
    id: "KPCPdKzBefj4BqwKVAmMnvUj",
    name: "Secret Shopper: Appointment Availability",
    isRequired: true,
  },
  {
    id: "fPrkUzYKDISHITjusb9WyqTg",
    name: "EVV Data Analysis",
    isRequired: true,
  },
  {
    id: "2wrlQNlvY8d3qZ6pwmH4pqYA",
    name: "Review of Grievances Related to Access",
    isRequired: true,
  },
  {
    id: "j9XspYm012nfntIjHWr4mjly",
    name: "Encounter Data Analysis",
    isRequired: true,
  },
];

export function getDefaultAnalysisMethodIds() {
  return DEFAULT_ANALYSIS_METHODS.map((method) => method.id);
}

// TIMEOUT PARAMS
export const IDLE_WINDOW = 30 * 60 * 1000; // ms
export const PROMPT_AT = 29 * 60 * 1000; //ms

// REPORT ROUTES FOR FIRST SECTION OF A PROGRAM
export const INITIAL_REPORT_ROUTES = ["/mcpar", "/mlr", "/naaar"];

// NAAAR
export const exceptionsStatus = "Exceptions granted";
export const nonComplianceStatus = "Non-compliant";

export const exceptionsNonComplianceStatusDisplay = {
  [exceptionsStatus]: "E",
  [nonComplianceStatus]: "N",
} as AnyObject;

export const nonCompliantLabel =
  "No, the plan does not comply on all standards based on all analyses and/or exceptions granted";

export const planComplianceStandardKey = "planCompliance43868_standard";
export const planComplianceStandardExceptionsLabel =
  "Exceptions granted under 42 C.F.R. § 438.68(d)";

export const GeomappingChildJson = [
  {
    id: "geomapping_complianceFrequency",
    type: "checkbox",
    validation: "checkboxOneOptional",
    props: {
      label: "Frequency of compliance findings (optional)",
      hint: "Instructions",
      choices: [
        {
          id: "c595832f837848118f",
          label: "Report results by quarter",
          children: [
            {
              id: "geoEnrolleesMeetingStandard",
              type: "radio",
              validation: "radioOptional",
              props: {
                choices: [
                  {
                    id: "1Bv4pXDFwPxCtfWnwQ3o4f",
                    label: "Percent of enrollees that met the standard",
                    children: [
                      {
                        id: "geoQ1PercentMetStandard",
                        type: "number",
                        validation: "numberOptional",
                        props: {
                          label: "Q1 (optional)",
                          mask: "percentage",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "geoQ2PercentMetStandard",
                        type: "number",
                        validation: "numberOptional",
                        props: {
                          label: "Q2 (optional)",
                          mask: "percentage",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "geoQ3PercentMetStandard",
                        type: "number",
                        validation: "numberOptional",
                        props: {
                          label: "Q3 (optional)",
                          mask: "percentage",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "geoQ4PercentMetStandard",
                        type: "number",
                        validation: "numberOptional",
                        props: {
                          label: "Q4 (optional)",
                          mask: "percentage",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                    ],
                  },
                  {
                    id: "oDBsJxz2uYsFEPJX5tsicD",
                    label: "Actual maximum time",
                    children: [
                      {
                        id: "geoQ1ActualMaxTime",
                        type: "number",
                        validation: "numberOptional",
                        props: {
                          label: "Q1 (optional)",
                          mask: "percentage",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "geoQ2ActualMaxTime",
                        type: "number",
                        validation: "numberOptional",
                        props: {
                          label: "Q2 (optional)",
                          mask: "percentage",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "geoQ3ActualMaxTime",
                        type: "number",
                        validation: "numberOptional",
                        props: {
                          label: "Q3 (optional)",
                          mask: "percentage",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "geoQ4ActualMaxTime",
                        type: "number",
                        validation: "numberOptional",
                        props: {
                          label: "Q4 (optional)",
                          mask: "percentage",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                    ],
                  },
                  {
                    id: "ckGB89dyJ9spyFn692tihL",
                    label: "Actual maximum distance",
                    children: [
                      {
                        id: "geoQ1ActualMaxDist",
                        type: "number",
                        validation: "numberOptional",
                        props: {
                          label: "Q1 (optional)",
                          mask: "comma-separated",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "geoQ2ActualMaxDist",
                        type: "number",
                        validation: "numberOptional",
                        props: {
                          label: "Q2 (optional)",
                          mask: "comma-separated",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "geoQ3ActualMaxDist",
                        type: "number",
                        validation: "numberOptional",
                        props: {
                          label: "Q3 (optional)",
                          mask: "comma-separated",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "geoQ4ActualMaxDist",
                        type: "number",
                        validation: "numberOptional",
                        props: {
                          label: "Q4 (optional)",
                          mask: "comma-separated",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        {
          id: "45PQX2mTtbVrsZtiR2ZFns",
          label: "Report results annually",
          children: [
            {
              id: "geoReportResultsAnnually",
              type: "radio",
              validation: "radioOptional",
              props: {
                choices: [
                  {
                    id: "8WCHVPuNhV9cK4nDh1syqX",
                    label: "Percent of enrollees that met the standard",
                    children: [
                      {
                        id: "geoAnnualPercentMetStandard",
                        type: "number",
                        validation: "numberOptional",
                        props: {
                          label: "Annual (optional)",
                          mask: "percentage",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "geoAnnualPercentMetStandardDate",
                        type: "date",
                        validation: {
                          type: "date",
                        },
                        props: {
                          label:
                            "Date of analysis of annual snapshot (optional)",
                        },
                      },
                    ],
                  },
                  {
                    id: "j44DG9RkDA1FwuYN3SM8zA",
                    label: "Actual maximum time",
                    children: [
                      {
                        id: "geoAnnualMaxTime",
                        type: "number",
                        validation: "numberOptional",
                        props: {
                          label: "Annual (optional)",
                          mask: "comma-separated",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "geoAnnualMaxTimeDate",
                        type: "date",
                        validation: {
                          type: "dateOptional",
                        },
                        props: {
                          label:
                            "Date of analysis of annual snapshot (optional)",
                        },
                      },
                    ],
                  },
                  {
                    id: "qJ8FA2U5ri5mfuwe6PCJhP",
                    label: "Actual maximum distance",
                    children: [
                      {
                        id: "geoActualMaxDistance",
                        type: "number",
                        validation: "numberOptional",
                        props: {
                          label: "Annual (optional)",
                          mask: "comma-separated",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "geoActualMaxDistanceDate",
                        type: "date",
                        validation: {
                          type: "date",
                        },
                        props: {
                          label:
                            "Date of analysis of annual snapshot (optional)",
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  },
];
