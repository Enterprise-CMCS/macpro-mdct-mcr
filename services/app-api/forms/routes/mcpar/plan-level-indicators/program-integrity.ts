import {
  DrawerFormRoute,
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const programIntegrityRoute: DrawerFormRoute = {
  name: "X: Program Integrity",
  path: "/mcpar/plan-level-indicators/program-integrity",
  pageType: PageTypes.DRAWER,
  entityType: EntityType.PLANS,
  verbiage: {
    intro: {
      section: "Section D: Plan-Level Indicators",
      subsection: "Topic X. Program Integrity",
      spreadsheet: "D1_Plan_Set",
    },
    dashboardTitle: "Report on program integrity for each plan",
    drawerTitle: "Program integrity for {{name}}",
    missingEntityMessage: [
      {
        type: "p",
        children: [
          {
            type: "html",
            content:
              "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
          },
          {
            type: "internalLink",
            content: "Add Plans",
            props: {
              to: "/mcpar/program-information/add-plans",
            },
          },
        ],
      },
    ],
  },
  drawerForm: {
    id: "dpi",
    fields: [
      {
        id: "plan_dedicatedProgramIntegrityStaff",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.X.1 Dedicated program integrity staff",
          hint: "Report or enter the number of dedicated program integrity staff for routine internal monitoring and compliance risks. Refer to 42 CFR 438.608(a)(1)(vii).",
          mask: "comma-separated",
        },
      },
      {
        id: "plan_openedProgramIntegrityInvestigations",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.X.2 Count of opened program integrity investigations",
          hint: "How many program integrity investigations were opened by the plan during the reporting year?",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedProgramIntegrityInvestigations",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.X.4 Count of resolved program integrity investigations",
          hint: "How many program integrity investigations were resolved by the plan during the reporting year?",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_programIntegrityReferralPath",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label:
            "D1.X.6 Referral path for program integrity referrals to the state",
          hint: "What is the referral path that the plan uses to make program integrity referrals to the state? Select one.",
          choices: [
            {
              id: "1LOghpdQOkaOd76btMJ8qA",
              label:
                "Makes referrals to the Medicaid Fraud Control Unit (MFCU) only",
              children: [
                {
                  id: "plan_mfcuProgramIntegrityReferrals",
                  type: ReportFormFieldType.NUMBER,
                  validation: {
                    type: ValidationType.NUMBER,
                    nested: true,
                    parentFieldName: "plan_programIntegrityReferralPath",
                  },
                  props: {
                    label:
                      "D1.X.7 Count of program integrity referrals to the state",
                    hint: "Enter the total number of program integrity referrals made during the reporting year.",
                    mask: "comma-separated",
                    decimalPlacesToRoundTo: 0,
                  },
                },
              ],
            },
            {
              id: "xkYWhuCMfYlT9MOWSLWk5JZb",
              label: "Makes referrals to the State Medicaid Agency (SMA) only",
              children: [
                {
                  id: "plan_smaProgramIntegrityReferrals",
                  type: ReportFormFieldType.NUMBER,
                  validation: {
                    type: ValidationType.NUMBER,
                    nested: true,
                    parentFieldName: "plan_programIntegrityReferralPath",
                  },
                  props: {
                    label:
                      "D1.X.7 Count of program integrity referrals to the state",
                    hint: "Enter the count of program integrity referrals that the plan made to the state in the past year. Enter the count of referrals made.",
                    mask: "comma-separated",
                    decimalPlacesToRoundTo: 0,
                  },
                },
              ],
            },
            {
              id: "Urpmgw3wiUWyYfiFg8OTNQ",
              label: "Makes referrals to the SMA and MFCU concurrently",
              children: [
                {
                  id: "plan_smaMfcuConcurrentProgramIntegrityReferrals",
                  type: ReportFormFieldType.NUMBER,
                  validation: {
                    type: ValidationType.NUMBER,
                    nested: true,
                    parentFieldName: "plan_programIntegrityReferralPath",
                  },
                  props: {
                    label:
                      "D1.X.7 Count of program integrity referrals to the state",
                    hint: "Enter the count of program integrity referrals that the plan made to the state in the past year. Enter the count of unduplicated referrals.",
                    mask: "comma-separated",
                    decimalPlacesToRoundTo: 0,
                  },
                },
              ],
            },
            {
              id: "ZGHlkg7EEkSb4gin6YSNlg",
              label:
                "Makes some referrals to the SMA and others directly to the MFCU",
              children: [
                {
                  id: "plan_smaMfcuAggregateProgramIntegrityReferrals",
                  type: ReportFormFieldType.NUMBER,
                  validation: {
                    type: ValidationType.NUMBER,
                    nested: true,
                    parentFieldName: "plan_programIntegrityReferralPath",
                  },
                  props: {
                    label:
                      "D1.X.7 Count of program integrity referrals to the state",
                    hint: "Enter the count of program integrity referrals that the plan made to the state in the past year. Enter the count of referrals made to the SMA and the MFCU in aggregate.",
                    mask: "comma-separated",
                    decimalPlacesToRoundTo: 0,
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "plan_overpaymentReportingToStateStartDate",
        type: ReportFormFieldType.DATE,
        validation: ValidationType.DATE,
        props: {
          label: "D1.X.9a: Plan overpayment reporting to the state: Start Date",
          hint: "What is the start date of the reporting period covered by the plan’s latest overpayment recovery report submitted to the state?",
        },
      },
      {
        id: "plan_overpaymentReportingToStateEndDate",
        type: ReportFormFieldType.DATE,
        validation: ValidationType.DATE,
        props: {
          label: "D1.X.9b: Plan overpayment reporting to the state: End Date",
          hint: "What is the end date of the reporting period covered by the plan’s latest overpayment recovery report submitted to the state?",
        },
      },
      {
        id: "plan_overpaymentReportingToStateDollarAmount",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.X.9c: Plan overpayment reporting to the state: Dollar amount",
          hint: "From the plan’s latest annual overpayment recovery report, what is the total amount of overpayments recovered?",
          mask: "currency",
        },
      },
      {
        id: "plan_overpaymentReportingToStateCorrespondingYearPremiumRevenue",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.X.9d: Plan overpayment reporting to the state: Corresponding premium revenue",
          hint: "What is the total amount of premium revenue for the corresponding reporting period (D1.X.9a-b)? (Premium revenue as defined in MLR reporting under 438.8(f)(2))",
          mask: "currency",
        },
      },
      {
        id: "plan_beneficiaryCircumstanceChangeReportingFrequency",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "D1.X.10 Changes in beneficiary circumstances",
          hint: "Select the frequency the plan reports changes in beneficiary circumstances to the state.",
          choices: [
            {
              id: "D79APWVHmkGzLcmBQrRXOA",
              label: "Daily",
            },
            {
              id: "MdxvXlRKGk2mK1n3L0JVhg",
              label: "Weekly",
            },
            {
              id: "rhq0lLeGKUa0h8KDDmH0xw",
              label: "Bi-weekly",
            },
            {
              id: "LPHYHUonAU6CDMPSmG5VhA",
              label: "Monthly",
            },
            {
              id: "cuF3zAprGUGnP8KkSIVXow",
              label: "Bi-monthly",
            },
            {
              id: "erownxjo30SA9PI9VdATTA",
              label: "Quarterly",
            },
            {
              id: "2gx74mMf7Ou0BRI5Kyp2Ih",
              label: "Promptly when plan receives information about the change",
            },
          ],
        },
      },
    ],
  },
};
