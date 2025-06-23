// HOST DOMAIN
export const PRODUCTION_HOST_DOMAIN = "mdctmcr.cms.gov";

// FIELDS
export const dropdownDefaultOptionText = "- Select an option -";
export const dropdownNoReports = "No reports eligible for copy";

export const closeText = "Close";
export const saveAndCloseText = "Save & close";
export const drawerReminderText =
  "Complete all fields and select the “Save & close” button to save this section.";

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
    name: "Electronic Visit Verification Data Analysis",
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
} as { [key: string]: string };

export const nonCompliantLabels = {
  "438.68":
    "No, the plan does not comply on all standards based on all analyses and/or exceptions granted",
  "438.206":
    "No, the plan does not comply with all standards based on all analyses or exceptions granted",
};

export const nonCompliantValues = new Set(Object.values(nonCompliantLabels));

export const planComplianceStandardKey = "planCompliance43868_standard";
export const planComplianceStandardExceptionsLabel =
  "Exceptions granted under 42 C.F.R. § 438.68(d)";

export const GeomappingChildJson = [
  {
    id: "geomappingComplianceFrequency",
    type: "checkbox",
    validation: "checkboxOneOptional",
    props: {
      label: "Frequency of compliance findings (optional)",
      hint: "States may report additional details on the results produced from using geomapping, plan provider directory reviews, and secret shopper results. If the state uses one of these  methods to determine compliance, additional fields will be provided to report results by quarter or year. If the results fields provided are not applicable to the state’s compliance findings for this standard, or if the state uses different analyses methods for this standard, you can leave these fields and use the “Plan Deficiencies Description” free text box in the next question to describe the results of the analyses.",
      choices: [
        {
          id: "c595832f837848118f",
          label: "Report results by quarter",
          children: [
            {
              id: "enrolleesMeetingStandard",
              type: "radio",
              validation: "radioOptional",
              props: {
                choices: [
                  {
                    id: "1Bv4pXDFwPxCtfWnwQ3o4f",
                    label: "Percent of enrollees that met the standard",
                    children: [
                      {
                        id: "q1PercentMetStandard",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Q1 (optional)",
                          mask: "percentage",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "q2PercentMetStandard",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Q2 (optional)",
                          mask: "percentage",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "q3PercentMetStandard",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Q3 (optional)",
                          mask: "percentage",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "q4PercentMetStandard",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
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
                        id: "q1ActualMaxTime",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Q1 (optional)",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "q2ActualMaxTime",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Q2 (optional)",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "q3ActualMaxTime",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Q3 (optional)",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "q4ActualMaxTime",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Q4 (optional)",
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
                        id: "q1ActualMaxDist",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Q1 (optional)",
                          mask: "comma-separated",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "q2ActualMaxDist",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Q2 (optional)",
                          mask: "comma-separated",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "q3ActualMaxDist",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Q3 (optional)",
                          mask: "comma-separated",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "q4ActualMaxDist",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
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
              id: "reportResultsAnnually",
              type: "radio",
              validation: "radioOptional",
              props: {
                choices: [
                  {
                    id: "8WCHVPuNhV9cK4nDh1syqX",
                    label: "Percent of enrollees that met the standard",
                    children: [
                      {
                        id: "annualPercentMetStandard",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Annual (optional)",
                          mask: "percentage",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "annualPercentMetStandardDate",
                        type: "date",
                        validation: "dateOptional",
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
                        id: "annualMaxTime",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Annual (optional)",
                          mask: "comma-separated",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "annualMaxTimeDate",
                        type: "date",
                        validation: "dateOptional",
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
                        id: "actualMaxDistance",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Annual (optional)",
                          mask: "comma-separated",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "actualMaxDistanceDate",
                        type: "date",
                        validation: "dateOptional",
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

export const PlanProviderChildJson = [
  {
    id: "ppdrComplianceFrequency",
    type: "checkbox",
    validation: "checkboxOneOptional",
    props: {
      label: "Frequency of compliance findings (optional)",
      hint: "States may report additional details on the results produced from using geomapping, plan provider directory reviews, and secret shopper results. If the state uses one of these methods to determine compliance, additional fields will be provided to report results by quarter or year. If the results fields provided are not applicable to the state’s compliance findings for this standard, or if the state uses different analyses methods for this standard, you can leave these fields and use the “Plan Deficiencies Description” free text box in the next question to describe the results of the analyses.",
      choices: [
        {
          id: "sxC5M4JJz9qNCdNxJgQmJV",
          label: "Report results by quarter",
          children: [
            {
              id: "enrolleesMeetingStandard",
              type: "radio",
              validation: "radioOptional",
              props: {
                choices: [
                  {
                    id: "gRCpgad2dhXDrmucTw8cnu",
                    label: "Minimum number of network providers",
                    hint: "Report the minimum number of plan network providers.",
                    children: [
                      {
                        id: "q1NumberOfNetworkProviders",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Q1 (optional)",
                          mask: "comma-separated",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "q2NumberOfNetworkProviders",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Q2 (optional)",
                          mask: "comma-separated",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "q3NumberOfNetworkProviders",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Q3 (optional)",
                          mask: "comma-separated",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "q4NumberOfNetworkProviders",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Q4 (optional)",
                          mask: "comma-separated",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                    ],
                  },
                  {
                    id: "a8kZrrUYcfUrnTM8UuHNmi",
                    label: "Provider to enrollee ratio",
                    hint: "Report the calculated plan provider to enrollee ratio.",
                    children: [
                      {
                        id: "q1ProviderToEnrolleeRatio",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Q1 (optional)",
                          mask: "percentage",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "q2ProviderToEnrolleeRatio",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Q2 (optional)",
                          mask: "percentage",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "q3ProviderToEnrolleeRatio",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Q3 (optional)",
                          mask: "percentage",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "q4ProviderToEnrolleeRatio",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Q4 (optional)",
                          mask: "percentage",
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
          id: "wz9n6q8nuxdUKnaw7gWUoj",
          label: "Report results annually",
          children: [
            {
              id: "reportResultsAnnually",
              type: "radio",
              validation: "radioOptional",
              props: {
                choices: [
                  {
                    id: "j4ch2jWhesE7SHQZYQmvJV",
                    label: "Minimum number of network providers",
                    hint: "Report the minimum number of plan network providers.",
                    children: [
                      {
                        id: "annualMinimumNumberOfNetworkProviders",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Annual (optional)",
                          mask: "comma-separated",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "annualMinimumNumberOfNetworkProvidersDate",
                        type: "date",
                        validation: "dateOptional",
                        props: {
                          label:
                            "Date of analysis of annual snapshot (optional)",
                        },
                      },
                    ],
                  },
                  {
                    id: "dSHQvqgfa7YYoRBvSKkahW",
                    label: "Provider to enrollee ratio",
                    hint: "Report findings on the calculated plan provider to enrollee ratio.",
                    children: [
                      {
                        id: "annualProvidertoEnrolleeRatio",
                        type: "number",
                        validation: "numberNotLessThanZeroOptional",
                        props: {
                          label: "Annual (optional)",
                          mask: "percentage",
                          decimalPlacesToRoundTo: 0,
                        },
                      },
                      {
                        id: "annualProvidertoEnrolleeRatioDate",
                        type: "date",
                        validation: "dateOptional",
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

export const SecretShopperAppointmentAvailabilityChildJson = [
  {
    id: "ssaaComplianceFrequency",
    type: "checkbox",
    validation: "checkboxOneOptional",
    props: {
      label: "Frequency of compliance findings (optional)",
      hint: "States may report additional details on the results produced from using geomapping, plan provider directory reviews, and secret shopper results. If the state uses one of these  methods to determine compliance, additional fields will be provided to report results by quarter or year. If the results fields provided are not applicable to the state’s compliance findings for this standard, or if the state uses different analyses methods for this standard, you can leave these fields and use the “Plan Deficiencies Description” free text box in the next question to describe the results of the analyses.",
      choices: [
        {
          id: "9QZMDvvbiWrXcjr5Z1zcuV",
          label: "Report results by quarter",
          hint: "Report findings on the percent of plan providers that met the appointment wait time standard.",
          children: [
            {
              id: "q1PercentMetStandard",
              type: "number",
              validation: "numberNotLessThanZeroOptional",
              props: {
                label: "Q1 (optional)",
                mask: "percentage",
                decimalPlacesToRoundTo: 0,
              },
            },
            {
              id: "q2PercentMetStandard",
              type: "number",
              validation: "numberNotLessThanZeroOptional",
              props: {
                label: "Q2 (optional)",
                mask: "percentage",
                decimalPlacesToRoundTo: 0,
              },
            },
            {
              id: "q3PercentMetStandard",
              type: "number",
              validation: "numberNotLessThanZeroOptional",
              props: {
                label: "Q3 (optional)",
                mask: "percentage",
                decimalPlacesToRoundTo: 0,
              },
            },
            {
              id: "q4PercentMetStandard",
              type: "number",
              validation: "numberNotLessThanZeroOptional",
              props: {
                label: "Q4 (optional)",
                mask: "percentage",
                decimalPlacesToRoundTo: 0,
              },
            },
          ],
        },
        {
          id: "hnKktBxFGNr9jB1AgWLPXf",
          label: "Report results annually",
          hint: "Report findings on the percent of plan providers that met the appointment wait time standard.",
          children: [
            {
              id: "reportResultsAnnually",
              type: "number",
              validation: "numberNotLessThanZeroOptional",
              props: {
                label: "Annual (optional)",
                mask: "percentage",
                decimalPlacesToRoundTo: 0,
              },
            },
            {
              id: "annualPercentMetStandardDate",
              type: "date",
              validation: "dateOptional",
              props: {
                label: "Date of analysis of annual snapshot (optional)",
              },
            },
          ],
        },
      ],
    },
  },
];

export const suppressionText = "Suppressed for data privacy purposes";
