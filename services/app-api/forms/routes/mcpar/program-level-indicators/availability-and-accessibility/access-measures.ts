import {
  EntityType,
  ModalDrawerRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../utils/types";

export const accessMeasuresRoute: ModalDrawerRoute = {
  name: "Access Measures",
  path: "/mcpar/program-level-indicators/availability-and-accessibility/access-measures",
  pageType: PageTypes.MODAL_DRAWER,
  entityType: EntityType.ACCESS_MEASURES,
  verbiage: {
    intro: {
      section: "Section C: Program-Level Indicators",
      subsection: "Topic V. Availability, Accessibility and Network Adequacy",
      spreadsheet: "C2_Program_State",
      info: [
        {
          type: "heading",
          as: "h4",
          content: "Access Measures",
        },
        {
          type: "p",
          content:
            "Describe the measures the state uses to monitor availability, accessibility, and network adequacy. Report at the program level.",
        },
        {
          type: "p",
          content:
            "Revisions to the Medicaid managed care regulations in 2016 and 2020 built on existing requirements that managed care plans maintain provider networks sufficient to ensure adequate access to covered services by: (1) requiring states to develop quantitative network adequacy standards for at least eight specified provider types if covered under the contract, and to make these standards available online; (2) strengthening network adequacy monitoring requirements; and (3) addressing the needs of people with long-term care service needs (42 CFR 438.66; 42 CFR 438.68).",
        },
        {
          type: "p",
          content:
            "42 CFR 438.66(e) specifies that the MCPAR must provide information on and an assessment of the availability and accessibility of covered services within the MCO, PHIP, or PAHP contracts, including network adequacy standards for each managed care program.",
        },
      ],
    },
    dashboardTitle: "Access measure total count:",
    countEntitiesInTitle: true,
    addEntityButtonText: "Add access measure",
    editEntityButtonText: "Edit measure",
    addEditModalAddTitle: "Add access measure",
    addEditModalEditTitle: "Edit access measure",
    addEditModalMessage:
      "Complete the remaining indicators for this access measure by saving the measure and selecting “Enter measure details”.",
    deleteEntityButtonAltText: "Delete measure",
    deleteModalTitle: "Delete access measure?",
    deleteModalConfirmButtonText: "Yes, delete measure",
    deleteModalWarning:
      "You will lose all information entered for this measure. Are you sure you want to proceed?",
    entityUnfinishedMessage:
      "Complete the remaining indicators for this access measure by entering details.",
    enterEntityDetailsButtonText: "Enter details",
    editEntityDetailsButtonText: "Edit details",
    drawerTitle: "{{action}} details for access measure",
  },
  modalForm: {
    id: "cam-modal",
    fields: [
      {
        id: "accessMeasure_generalCategory",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "C2.V.1 General category",
          hint: "Select one.",
          choices: [
            {
              id: "XbR70C9iDU2yPtQXBuwZgA",
              label:
                "General quantitative availability and accessibility standard",
            },
            {
              id: "aSzsso583qbijUdXJnz8CS",
              label: "Exception to quantitative standard",
            },
          ],
        },
      },
      {
        id: "accessMeasure_standardDescription",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "C2.V.2 Measure standard",
          hint: "Describe the standard (e.g., 1 provider within 30 min or 30 miles).",
        },
      },
      {
        id: "accessMeasure_standardType",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "C2.V.3 Standard type",
          hint: "What is the standard type? Select one.",
          choices: [
            {
              id: "kBady0XnCUG8nxXWSHHeBg",
              label: "Maximum time to travel",
            },
            {
              id: "ZoChtaOBaUKbb5mc8J5Ttg",
              label: "Maximum distance to travel",
            },
            {
              id: "ufmG7LliEkSNgUxRfb736A",
              label: "Maximum time or distance",
            },
            {
              id: "5PhGxIGxvUGWyuJ8RGTABg",
              label: "Ease of getting a timely appointment",
            },
            {
              id: "E90BE7ESr0aUT0TBvTGqpA",
              label: "Appointment wait time",
            },
            {
              id: "c8ElWnGCxkeuR7Gf46G4Gw",
              label: "Hours of operation",
            },
            {
              id: "EUkZ4TchV0qx9Ebvf6W8wg",
              label: "Provider to enrollee ratios",
            },
            {
              id: "qsGpnAyE4EiGEyZweLmH3w",
              label: "Minimum number of network providers",
            },
            {
              id: "NrjpuHSmZka4YV22wVM1Zw",
              label: "Service fulfillment",
            },
            {
              id: "v7kDD0JjQUymHUGTlEwRfw",
              label: "Other, specify",
              children: [
                {
                  id: "accessMeasure_standardType-otherText",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "accessMeasure_standardType",
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  },
  drawerForm: {
    id: "cam-drawer",
    fields: [
      {
        id: "accessMeasure_providerType",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "C2.V.4 Provider type",
          hint: "Enter the core provider type the standard applies to. If the standard applies to multiple provider types, create a measure for each provider type. If you wish to specify the provider type, select the core type most suitable and then write in the more specific provider type.",
          choices: [
            {
              id: "7z1m6zajqUupPe89o3dAGQ",
              label: "Primary care",
              children: [
                {
                  id: "accessMeasure_providerType-primaryCareDetails",
                  type: ReportFormFieldType.TEXT,
                  validation: {
                    type: ValidationType.TEXT_OPTIONAL,
                    nested: true,
                    parentFieldName: "accessMeasure_providerType",
                    parentOptionId: "7z1m6zajqUupPe89o3dAGQ",
                  },
                  props: {
                    label: "Primary care specialist details (optional)",
                    hint: "e.g. Nurse Practitioner",
                  },
                },
              ],
            },
            {
              id: "5FfW1zf3rK1tb8DcuYuqc9",
              label: "Specialist",
              children: [
                {
                  id: "accessMeasure_providerType-specialistDetails",
                  type: ReportFormFieldType.TEXT,
                  validation: {
                    type: ValidationType.TEXT_OPTIONAL,
                    nested: true,
                    parentFieldName: "accessMeasure_providerType",
                    parentOptionId: "5FfW1zf3rK1tb8DcuYuqc9",
                  },
                  props: {
                    label: "Specialist details (optional)",
                    hint: "e.g. Cardiologist, endocrinologist",
                  },
                },
              ],
            },
            {
              id: "1sEWHEKgjwhjmtAyWoVhfW",
              label: "Mental health",
              children: [
                {
                  id: "accessMeasure_providerType-mentalHealthDetails",
                  type: ReportFormFieldType.TEXT,
                  validation: {
                    type: ValidationType.TEXT_OPTIONAL,
                    nested: true,
                    parentFieldName: "accessMeasure_providerType",
                    parentOptionId: "1sEWHEKgjwhjmtAyWoVhfW",
                  },
                  props: {
                    label: "Mental health specialist details (optional)",
                  },
                },
              ],
            },
            {
              id: "uF9g4CAo5Fwofxt8PYfLaQ",
              label: "Substance Use Disorder (SUD)",
            },
            {
              id: "vJePJt3T4mXyLfhEVhZujs",
              label: "OB/GYN",
            },
            {
              id: "KQtY7LuWG02dXq3ECotrVw",
              label: "Hospital",
            },
            {
              id: "n6KU5rXnvbvH6K6DzN26vV",
              label: "Pharmacy",
            },
            {
              id: "eepgjQEj4WhfSSLmEtp977",
              label: "Dental",
            },
            {
              id: "hqeJ3uJaUndRUEqNECsU3w",
              label: "LTSS",
            },
          ],
        },
      },
      {
        id: "accessMeasure_applicableRegion",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "C2.V.5 Applicable region(s)",
          hint: "Enter the region that the standard applies to. If the same standard applies to multiple regions but is not statewide, create a standard for each of the regions. If the standard is statewide but results are analyzed by region type, create a measure for each applicable region.",
          choices: [
            {
              id: "aZ4JmR9kfLKZEqQje3N1R1",
              label: "Statewide",
            },
            {
              id: "qBvku8G3wwxCdmhPaEjR24",
              label: "Large Metro",
            },
            {
              id: "bN865rwbefg1CVAw1tBDKw",
              label: "Metro",
            },
            {
              id: "6MMBiFws9Erv9fVRRpjUXL",
              label: "Micro",
            },
            {
              id: "H4Ldb3YGZ0OmBRYceGKDcA",
              label: "Rural",
            },
            {
              id: "eFMYKR5Xoi7xGChQfvDVA9",
              label: "Counties with Extreme Access Considerations (CEAC)",
            },
            {
              id: "XkGi9vuc506VhzDCR5oAkg",
              label: "Other, specify",
              children: [
                {
                  id: "accessMeasure_applicableRegion-otherText",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "accessMeasure_applicableRegion",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "accessMeasure_population",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "C2.V.6 Population",
          hint: "Enter the population that the standard applies to. If the standard applies to multiple populations, create a measure for each of those populations.",
          choices: [
            {
              id: "YtRX5yx7NEWkGfU9vDI03g",
              label: "Adult",
            },
            {
              id: "gYaReXNXW0WCFNAn3m7Lkg",
              label: "Pediatric",
            },
            {
              id: "ZRlpGJt4S0OoBWWSw4Z6mA",
              label: "Adult and pediatric",
            },
            {
              id: "cLwf5gMv2odDfN3CY4nhuu",
              label: "MLTSS",
            },
            {
              id: "ENItdUNlUkGlvoBtAPH6Tw",
              label: "Other, specify",
              children: [
                {
                  id: "accessMeasure_population-otherText",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "accessMeasure_population",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "accessMeasure_monitoringMethods",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX,
        props: {
          label: "C2.V.7 Monitoring methods",
          hint: "Select the method(s) utilized to assess compliance with the state's 42 C.F.R. § 438.68 and 42 C.F.R. § 438.206 standards. If a method is not listed, select “Custom method” and add details.",
          choices: [
            {
              id: "gbWqxtPWaUC1yUbmhWA0UA",
              label: "Geomapping",
            },
            {
              id: "G7GxcYWmhEqjrEQDBWRl3w",
              label: "Plan Provider Directory Review",
            },
            {
              id: "WZYsy13Kv3GZWpZcqyfmsAha",
              label: "Secret Shopper: Network Participation",
            },
            {
              id: "wtGWKuNsBxZ43NTZ45sZF5y7",
              label: "Secret Shopper: Appointment Availability",
            },
            {
              id: "cMhP8Jp6SUS9XvezaPLvLg",
              label: "Electronic Visit Verification Data Analysis",
            },
            {
              id: "bmQ1FmFPGk6S1g70ntAEcw",
              label: "Review of Grievances Related to Access",
            },
            {
              id: "h64Pn0WAtuQIpmIvlPKGqwR4",
              label: "Encounter Data Analysis",
            },
            {
              id: "ozFC7ZVX7EWXZiNB2Ajj3g",
              label: "Custom method",
              children: [
                {
                  id: "accessMeasure_monitoringMethods-otherText",
                  type: ReportFormFieldType.TEXT,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "accessMeasure_monitoringMethods",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "accessMeasure_oversightMethodFrequency",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "C2.V.8 Frequency of oversight methods",
          choices: [
            {
              id: "vtAjpZENepsmacGCddGdyt",
              label: "Weekly",
            },
            {
              id: "mbp348RqaieKqyrCsLhLi2",
              label: "Bi-weekly",
            },
            {
              id: "HrS3f4scOUCGvDQTc0ff8g",
              label: "Monthly",
            },
            {
              id: "jtJNpYg7E2wXw9mv9BEtzf",
              label: "Bi-monthly",
            },
            {
              id: "FA7SekH1aEO3pJtjugSGLA",
              label: "Quarterly",
            },
            {
              id: "scpt9nHDfxf9gvSJdKzwpu",
              label: "Semi-annually",
            },
            {
              id: "GiwsJsL2MUmmy735jGmGKA",
              label: "Annually",
            },
            {
              id: "RpBmNYucH0ugYLa9RGbLdA",
              label: "Other, specify",
              children: [
                {
                  id: "accessMeasure_oversightMethodFrequency-otherText",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "accessMeasure_oversightMethodFrequency",
                  },
                },
              ],
            },
            {
              id: "hqPoC1DF7cKy39f7fWKPrt",
              label: "Varies by plan",
            },
          ],
        },
      },
    ],
  },
};
