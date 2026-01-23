import {
  DrawerFormRoute,
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../utils/types";

export const programLevelAccessAndNetworkAdequacyStandardsRoute: DrawerFormRoute =
  {
    name: "II. Program-level access and network adequacy standards",
    path: "/naaar/program-level-access-and-network-adequacy-standards",
    pageType: PageTypes.DRAWER,
    entityType: EntityType.STANDARDS,
    verbiage: {
      intro: {
        subsection: "II. Program-level access and network adequacy standards",
        info: "Report each network adequacy standard included in managed care program contract for this program as required under 42 CFR § 438.68; select “Add standard” to report each unique standard. 42 § CFR 438.206 standards will be addressed in section III. Plan compliance.",
      },
      dashboardTitle: "Standard total count: ",
      countEntitiesInTitle: true,
      addEntityButtonText: "Add standard",
      deleteEntityButtonAltText: "Delete standard",
      deleteModalTitle: "Are you sure you want to delete this standard?",
      deleteModalConfirmButtonText: "Yes, delete standard",
      deleteModalWarning:
        "Are you sure you want to proceed? You will lose all information entered for this standard and within ‘Plan compliance’ in the NAAAR. The standard will remain in previously submitted NAAAR reports if applicable.",
      drawerTitle:
        "{{action}} access and network adequacy standard for {{name}}",
      missingEntityMessage: [
        {
          type: "p",
          children: [
            {
              type: "html",
              content:
                "This program is missing required information. You won’t be able to complete this section until you’ve completed all the required questions in section I. State and program information. Report on ",
            },
            {
              type: "internalLink",
              content: "Provider type coverage",
              props: {
                to: "/naaar/state-and-program-information/provider-type-coverage",
              },
            },
            {
              type: "html",
              content: " and ",
            },
            {
              type: "internalLink",
              content: "Analysis methods",
              props: {
                to: "/naaar/state-and-program-information/analysis-methods",
              },
            },
            {
              type: "html",
              content: ".",
            },
          ],
        },
      ],
    },
    drawerForm: {
      id: "danas",
      fields: [
        {
          id: "standard_coreProviderType",
          type: ReportFormFieldType.RADIO,
          validation: ValidationType.RADIO,
          props: {
            label: "II.A.1 Provider type covered by standard",
            hint: "Enter the provider type the standard applies to. To further specify the provider type, select the core type most suitable and then add the more specific provider types under “Additional specialty details”, which will appear as a text field after the provider type is selected. For Primary care, Specialist, and OB/GYN provider types, fields for additional details are required and cannot be left blank.<br><br>Do not use this section to indicate populations associated with this provider type (e.g., adult, pediatric, LTSS); these details should be entered in the dedicated population fields below.",
            choices: [
              {
                id: "standard_coreProviderType-UZK4hxPVnuYGcIgNzYFHCk",
                label: "Primary care",
                children: [
                  {
                    id: "standard_coreProviderType-UZK4hxPVnuYGcIgNzYFHCk",
                    type: ReportFormFieldType.TEXT,
                    validation: {
                      type: ValidationType.TEXT,
                      nested: true,
                      parentFieldName: "standard_coreProviderType",
                      parentOptionId:
                        "standard_coreProviderType-UZK4hxPVnuYGcIgNzYFHCk",
                    },
                    props: {
                      label: "II.A.2 Primary care specialty details (required)",
                      hint: "Include the licensed practitioners authorized to serve as primary care providers in this Medicaid managed care program (e.g., family physician, nurse practitioner, physician assistant) that are covered by this standard.",
                    },
                  },
                ],
              },
              {
                id: "standard_coreProviderType-uITThePQiXntwGGViPTD62",
                label: "Specialist",
                children: [
                  {
                    id: "standard_coreProviderType-uITThePQiXntwGGViPTD62",
                    type: ReportFormFieldType.TEXT,
                    validation: {
                      type: ValidationType.TEXT,
                      nested: true,
                      parentFieldName: "standard_coreProviderType",
                      parentOptionId:
                        "standard_coreProviderType-uITThePQiXntwGGViPTD62",
                    },
                    props: {
                      label: "II.A.2 Specialty details (required)",
                      hint: "Include all specialties (except for Mental health) within this category, e.g., cardiology, endocrinology.",
                    },
                  },
                ],
              },
              {
                id: "standard_coreProviderType-9kBoKCLD1dYizieU5psnJi",
                label: "Mental health",
                children: [
                  {
                    id: "standard_coreProviderType-9kBoKCLD1dYizieU5psnJi",
                    type: ReportFormFieldType.TEXT,
                    validation: {
                      type: ValidationType.TEXT_OPTIONAL,
                      nested: true,
                      parentFieldName: "standard_coreProviderType",
                      parentOptionId:
                        "standard_coreProviderType-9kBoKCLD1dYizieU5psnJi",
                    },
                    props: {
                      label:
                        "II.A.2 Mental health specialty details (optional)",
                    },
                  },
                ],
              },
              {
                id: "standard_coreProviderType-qbR8X0YAh8vObedJPx6QTJ",
                label: "Substance Use Disorder (SUD)",
                children: [
                  {
                    id: "standard_coreProviderType-qbR8X0YAh8vObedJPx6QTJ",
                    type: ReportFormFieldType.TEXT,
                    validation: {
                      type: ValidationType.TEXT_OPTIONAL,
                      nested: true,
                      parentFieldName: "standard_coreProviderType",
                      parentOptionId:
                        "standard_coreProviderType-qbR8X0YAh8vObedJPx6QTJ",
                    },
                    props: {
                      label:
                        "II.A.2 Substance Use Disorder (SUD) specialty details (optional)",
                    },
                  },
                ],
              },
              {
                id: "standard_coreProviderType-kV7553HIWXekySIFLiMXLW",
                label: "OB/GYN",
                children: [
                  {
                    id: "standard_coreProviderType-kV7553HIWXekySIFLiMXLW",
                    type: ReportFormFieldType.TEXT,
                    validation: {
                      type: ValidationType.TEXT,
                      nested: true,
                      parentFieldName: "standard_coreProviderType",
                      parentOptionId:
                        "standard_coreProviderType-kV7553HIWXekySIFLiMXLW",
                    },
                    props: {
                      label: "II.A.2 OB/GYN specialty details (required)",
                      hint: "Include the licensed practitioners authorized to provide obstetric and gynecological care (e.g., OB/GYN physician, certified nurse midwife) that are covered by this standard.",
                    },
                  },
                ],
              },
              {
                id: "standard_coreProviderType-nzmRTbJeqBCoAabR4oHrrh",
                label: "Hospital",
                children: [
                  {
                    id: "standard_coreProviderType-nzmRTbJeqBCoAabR4oHrrh",
                    type: ReportFormFieldType.TEXT,
                    validation: {
                      type: ValidationType.TEXT_OPTIONAL,
                      nested: true,
                      parentFieldName: "standard_coreProviderType",
                      parentOptionId:
                        "standard_coreProviderType-nzmRTbJeqBCoAabR4oHrrh",
                    },
                    props: {
                      label: "II.A.2 Hospital specialty details (optional)",
                    },
                  },
                ],
              },
              {
                id: "standard_coreProviderType-cb4y58UmsRXVITpWL7l9up",
                label: "Pharmacy",
                children: [
                  {
                    id: "standard_coreProviderType-cb4y58UmsRXVITpWL7l9up",
                    type: ReportFormFieldType.TEXT,
                    validation: {
                      type: ValidationType.TEXT_OPTIONAL,
                      nested: true,
                      parentFieldName: "standard_coreProviderType",
                      parentOptionId:
                        "standard_coreProviderType-cb4y58UmsRXVITpWL7l9up",
                    },
                    props: {
                      label: "II.A.2 Pharmacy specialty details (optional)",
                    },
                  },
                ],
              },
              {
                id: "standard_coreProviderType-tlzAMYfH4I7iIl5pjqAm7R",
                label: "Dental",
                children: [
                  {
                    id: "standard_coreProviderType-tlzAMYfH4I7iIl5pjqAm7R",
                    type: ReportFormFieldType.TEXT,
                    validation: {
                      type: ValidationType.TEXT_OPTIONAL,
                      nested: true,
                      parentFieldName: "standard_coreProviderType",
                      parentOptionId:
                        "standard_coreProviderType-tlzAMYfH4I7iIl5pjqAm7R",
                    },
                    props: {
                      label: "II.A.2 Dental specialty details (optional)",
                    },
                  },
                ],
              },
              {
                id: "standard_coreProviderType-WrMpSdivds4c0XfN2RPlRd",
                label: "LTSS",
                children: [
                  {
                    id: "standard_coreProviderType-WrMpSdivds4c0XfN2RPlRd",
                    type: ReportFormFieldType.TEXT,
                    validation: {
                      type: ValidationType.TEXT_OPTIONAL,
                      nested: true,
                      parentFieldName: "standard_coreProviderType",
                      parentOptionId:
                        "standard_coreProviderType-WrMpSdivds4c0XfN2RPlRd",
                    },
                    props: {
                      label: "II.A.2 LTSS specialty details (optional)",
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          id: "standard_standardType",
          type: ReportFormFieldType.RADIO,
          validation: ValidationType.RADIO,
          props: {
            label: "II.A.3 Standard type",
            hint: "What is the standard type? Select the category that most closely represents the standard type.",
            choices: [
              {
                id: "kIrheUXLpOwF7OEypso8Ylhs",
                label: "Maximum time to travel",
                children: [
                  {
                    id: "standard_standardDescription-kIrheUXLpOwF7OEypso8Ylhs",
                    type: ReportFormFieldType.TEXTAREA,
                    validation: {
                      type: ValidationType.TEXT,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "kIrheUXLpOwF7OEypso8Ylhs",
                    },
                    props: {
                      label: "II.A.4 Standard description",
                    },
                  },
                  {
                    id: "standard_analysisMethodsUtilized-kIrheUXLpOwF7OEypso8Ylhs",
                    type: ReportFormFieldType.CHECKBOX,
                    validation: {
                      type: ValidationType.CHECKBOX,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "kIrheUXLpOwF7OEypso8Ylhs",
                    },
                    props: {
                      label:
                        "II.A.5 Analysis method(s) utilized to assess compliance for this standard",
                      hint: "Select the method(s) utilized to assess compliance with this standard. If a method is not listed here, add it in the “Analysis Methods” section.",
                      choices: [],
                    },
                  },
                ],
              },
              {
                id: "SDrVTHVxFa2YKrlBYjcqavbN",
                label: "Maximum distance to travel",
                children: [
                  {
                    id: "standard_standardDescription-SDrVTHVxFa2YKrlBYjcqavbN",
                    type: ReportFormFieldType.TEXTAREA,
                    validation: {
                      type: ValidationType.TEXT,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "SDrVTHVxFa2YKrlBYjcqavbN",
                    },
                    props: {
                      label: "II.A.4 Standard description",
                      hint: "e.g., 15 days",
                    },
                  },
                  {
                    id: "standard_analysisMethodsUtilized-SDrVTHVxFa2YKrlBYjcqavbN",
                    type: ReportFormFieldType.CHECKBOX,
                    validation: {
                      type: ValidationType.CHECKBOX,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "SDrVTHVxFa2YKrlBYjcqavbN",
                    },
                    props: {
                      label:
                        "II.A.5 Analysis method(s) utilized to assess compliance for this standard",
                      hint: "Select the method(s) utilized to assess compliance with this standard. If a method is not listed here, add it in the “Analysis Methods” section.",
                      choices: [],
                    },
                  },
                ],
              },
              {
                id: "fFSst8ncbSukHlX66fqV0udO",
                label: "Maximum time or distance",
                children: [
                  {
                    id: "standard_standardDescription-fFSst8ncbSukHlX66fqV0udO",
                    type: ReportFormFieldType.TEXTAREA,
                    validation: {
                      type: ValidationType.TEXT,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "fFSst8ncbSukHlX66fqV0udO",
                    },
                    props: {
                      label: "II.A.4 Standard description",
                      hint: "e.g., 1 provider within 30 min or 30 miles",
                    },
                  },
                  {
                    id: "standard_analysisMethodsUtilized-fFSst8ncbSukHlX66fqV0udO",
                    type: ReportFormFieldType.CHECKBOX,
                    validation: {
                      type: ValidationType.CHECKBOX,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "fFSst8ncbSukHlX66fqV0udO",
                    },
                    props: {
                      label:
                        "II.A.5 Analysis method(s) utilized to assess compliance for this standard",
                      hint: "Select the method(s) utilized to assess compliance with this standard. If a method is not listed here, add it in the “Analysis Methods” section.",
                      choices: [],
                    },
                  },
                ],
              },
              {
                id: "lG0CeH7LIO5iGxjpaKE8v37C",
                label: "Appointment wait time",
                children: [
                  {
                    id: "standard_standardDescription-lG0CeH7LIO5iGxjpaKE8v37C",
                    type: ReportFormFieldType.TEXTAREA,
                    validation: {
                      type: ValidationType.TEXT,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "lG0CeH7LIO5iGxjpaKE8v37C",
                    },
                    props: {
                      label: "II.A.4 Standard description",
                    },
                  },
                  {
                    id: "standard_analysisMethodsUtilized-lG0CeH7LIO5iGxjpaKE8v37C",
                    type: ReportFormFieldType.CHECKBOX,
                    validation: {
                      type: ValidationType.CHECKBOX,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "lG0CeH7LIO5iGxjpaKE8v37C",
                    },
                    props: {
                      label:
                        "II.A.5 Analysis method(s) utilized to assess compliance for this standard for this program",
                      hint: "Select the method(s) utilized to assess compliance with this standard. If a method is not listed here, add it in the “Analysis Methods” section.",
                      choices: [],
                    },
                  },
                ],
              },
              {
                id: "vGdzNKCsiudeNeUJZgU5qhdz",
                label: "Provider to enrollee ratios",
                children: [
                  {
                    id: "standard_standardDescription-vGdzNKCsiudeNeUJZgU5qhdz",
                    type: ReportFormFieldType.TEXTAREA,
                    validation: {
                      type: ValidationType.TEXT,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "vGdzNKCsiudeNeUJZgU5qhdz",
                    },
                    props: {
                      label: "II.A.4 Standard description",
                    },
                  },
                  {
                    id: "standard_analysisMethodsUtilized-vGdzNKCsiudeNeUJZgU5qhdz",
                    type: ReportFormFieldType.CHECKBOX,
                    validation: {
                      type: ValidationType.CHECKBOX,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "vGdzNKCsiudeNeUJZgU5qhdz",
                    },
                    props: {
                      label:
                        "II.A.5 Analysis method(s) utilized to assess compliance for this standard",
                      hint: "Select the method(s) utilized to assess compliance with this standard. If a method is not listed here, add it in the “Analysis Methods” section.",
                      choices: [],
                    },
                  },
                ],
              },
              {
                id: "hdz3tEHdEBvRIIdgaovgEjaa",
                label: "Minimum number of network providers",
                children: [
                  {
                    id: "standard_standardDescription-hdz3tEHdEBvRIIdgaovgEjaa",
                    type: ReportFormFieldType.TEXTAREA,
                    validation: {
                      type: ValidationType.TEXT,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "hdz3tEHdEBvRIIdgaovgEjaa",
                    },
                    props: {
                      label: "II.A.4 Standard description",
                    },
                  },
                  {
                    id: "standard_analysisMethodsUtilized-hdz3tEHdEBvRIIdgaovgEjaa",
                    type: ReportFormFieldType.CHECKBOX,
                    validation: {
                      type: ValidationType.CHECKBOX,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "hdz3tEHdEBvRIIdgaovgEjaa",
                    },
                    props: {
                      label:
                        "II.A.5 Analysis method(s) utilized to assess compliance for this standard",
                      hint: "Select the method(s) utilized to assess compliance with this standard. If a method is not listed here, add it in the “Analysis Methods” section.",
                      choices: [],
                    },
                  },
                ],
              },
              {
                id: "EuccyPRHBiaTVhF1HMHnkUcR",
                label: "Hours of operation",
                children: [
                  {
                    id: "standard_standardDescription-EuccyPRHBiaTVhF1HMHnkUcR",
                    type: ReportFormFieldType.TEXTAREA,
                    validation: {
                      type: ValidationType.TEXT,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "EuccyPRHBiaTVhF1HMHnkUcR",
                    },
                    props: {
                      label: "II.A.4 Standard description",
                    },
                  },
                  {
                    id: "standard_analysisMethodsUtilized-EuccyPRHBiaTVhF1HMHnkUcR",
                    type: ReportFormFieldType.CHECKBOX,
                    validation: {
                      type: ValidationType.CHECKBOX,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "EuccyPRHBiaTVhF1HMHnkUcR",
                    },
                    props: {
                      label:
                        "II.A.5 Analysis method(s) utilized to assess compliance for this standard",
                      hint: "Select the method(s) utilized to assess compliance with this standard. If a method is not listed here, add it in the “Analysis Methods” section.",
                      choices: [],
                    },
                  },
                ],
              },
              {
                id: "tcIQ324hNsgHwHteoDgfCh08",
                label: "Ease of getting a timely appointment",
                children: [
                  {
                    id: "standard_standardDescription-tcIQ324hNsgHwHteoDgfCh08",
                    type: ReportFormFieldType.TEXTAREA,
                    validation: {
                      type: ValidationType.TEXT,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "tcIQ324hNsgHwHteoDgfCh08",
                    },
                    props: {
                      label: "II.A.4 Standard description",
                    },
                  },
                  {
                    id: "standard_analysisMethodsUtilized-tcIQ324hNsgHwHteoDgfCh08",
                    type: ReportFormFieldType.CHECKBOX,
                    validation: {
                      type: ValidationType.CHECKBOX,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "tcIQ324hNsgHwHteoDgfCh08",
                    },
                    props: {
                      label:
                        "II.A.5 Analysis method(s) utilized to assess compliance for this standard",
                      hint: "Select the method(s) utilized to assess compliance with this standard. If a method is not listed here, add it in the “Analysis Methods” section.",
                      choices: [],
                    },
                  },
                ],
              },
              {
                id: "9eion8H8PNrCP0AeiikpsKbx",
                label: "Service fulfillment",
                children: [
                  {
                    id: "standard_standardDescription-9eion8H8PNrCP0AeiikpsKbx",
                    type: ReportFormFieldType.TEXTAREA,
                    validation: {
                      type: ValidationType.TEXT,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "9eion8H8PNrCP0AeiikpsKbx",
                    },
                    props: {
                      label: "II.A.4 Standard description",
                    },
                  },
                  {
                    id: "standard_analysisMethodsUtilized-9eion8H8PNrCP0AeiikpsKbx",
                    type: ReportFormFieldType.CHECKBOX,
                    validation: {
                      type: ValidationType.CHECKBOX,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "9eion8H8PNrCP0AeiikpsKbx",
                    },
                    props: {
                      label:
                        "II.A.5 Analysis method(s) utilized to assess compliance for this standard",
                      hint: "Select the method(s) utilized to assess compliance with this standard. If a method is not listed here, add it in the “Analysis Methods” section.",
                      choices: [],
                    },
                  },
                ],
              },
              {
                id: "Uil8wXl6t3aBsI4W8pQZlO5P",
                label: "Other, specify",
                children: [
                  {
                    id: "standard_standardType-otherText",
                    type: ReportFormFieldType.TEXT,
                    validation: {
                      type: ValidationType.TEXT,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "Uil8wXl6t3aBsI4W8pQZlO5P",
                    },
                  },
                  {
                    id: "standard_standardDescription-Uil8wXl6t3aBsI4W8pQZlO5P",
                    type: ReportFormFieldType.TEXTAREA,
                    validation: {
                      type: ValidationType.TEXT,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "Uil8wXl6t3aBsI4W8pQZlO5P",
                    },
                    props: {
                      label: "II.A.4 Standard description",
                    },
                  },
                  {
                    id: "standard_analysisMethodsUtilized-Uil8wXl6t3aBsI4W8pQZlO5P",
                    type: ReportFormFieldType.CHECKBOX,
                    validation: {
                      type: ValidationType.CHECKBOX,
                      nested: true,
                      parentFieldName: "standard_standardType",
                      parentOptionId: "Uil8wXl6t3aBsI4W8pQZlO5P",
                    },
                    props: {
                      label:
                        "II.A.5 Analysis method(s) utilized to assess compliance for this standard",
                      hint: "Select the method(s) utilized to assess compliance with this standard. If a method is not listed here, add it in the “Analysis Methods” section.",
                      choices: [],
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          id: "standard_populationCoveredByStandard",
          type: ReportFormFieldType.RADIO,
          validation: ValidationType.RADIO,
          props: {
            label: "II.A.6 Population covered by standard",
            hint: "Enter the population that the standard applies to.",
            choices: [
              {
                id: "I71x1VFmmQJmKSUlFcJVS8cT",
                label: "Adult",
              },
              {
                id: "U0Y4jZ4z63WrUKgCH4gL2SNG",
                label: "Pediatric",
              },
              {
                id: "PiEUqV9EIj4C5jNHK9kx3guG",
                label: "MLTSS",
              },
              {
                id: "R9biNBHU0rqpWFncNKbsD7zQ",
                label: "Other, specify",
                children: [
                  {
                    id: "standard_populationCoveredByStandard-otherText",
                    type: ReportFormFieldType.TEXT,
                    validation: {
                      type: ValidationType.TEXT,
                      nested: true,
                      parentFieldName: "standard_populationCoveredByStandard",
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          id: "standard_applicableRegion",
          type: ReportFormFieldType.RADIO,
          validation: ValidationType.RADIO,
          props: {
            label: "II.A.7 Applicable region",
            hint: "Enter the region that the standard applies to. If the same standard applies to multiple regions but is not statewide, create a standard for each of the regions. If the standard is statewide but results are analyzed by region type, create a standard for each applicable region.",
            choices: [
              {
                id: "KaDliEkRCXvPNlRS7DVjjt9q",
                label: "Statewide",
              },
              {
                id: "bXUThZe8ED78Q0CdZDfy6vWU",
                label: "Large metro",
              },
              {
                id: "LEBy7hX77pU9dDnQyiQxVbY3",
                label: "Metro",
              },
              {
                id: "eSA8gou1MZodAgsvNu6KoW5M",
                label: "Urban",
              },
              {
                id: "nTsvcnVAkbz1YPXzrJGyuk57",
                label: "Micro",
              },
              {
                id: "vtr616uOBJzYTgak0yOS2X3Z",
                label: "Rural",
              },
              {
                id: "PDJiZbCvszRtn2wFyCnLuhbh",
                label: "Frontier",
              },
              {
                id: "K72J3FGRlXMyIV2j43TDGs7R",
                label: "Counties with Extreme Access Considerations (CEAC)",
              },
              {
                id: "fbT7UNHncgylfEfa8PqDP80j",
                label: "Other, specify",
                children: [
                  {
                    id: "standard_applicableRegion-otherText",
                    type: ReportFormFieldType.TEXT,
                    validation: {
                      type: ValidationType.TEXT,
                      nested: true,
                      parentFieldName: "standard_applicableRegion",
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  };
