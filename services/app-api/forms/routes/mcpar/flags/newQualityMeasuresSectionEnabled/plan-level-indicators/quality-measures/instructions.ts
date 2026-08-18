import { FormRoute, PageTypes } from "../../../../../../../utils/types";

export const instructionsRoute: FormRoute = {
  name: "Instructions",
  path: "/mcpar/plan-level-indicators/quality-measures/instructions",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section D: Plan-Level Indicators",
      subsection: "Topic VII: Quality & Performance Measures",
      spreadsheet: "D2_Program_QualityMeasures",
      info: [
        {
          type: "heading",
          as: "h4",
          content: "Background",
        },
        {
          type: "p",
          content:
            "This report collects information about your program and an assessment of how it operates. This should include how an MCO, PIHP, or PAHP performs on quality measures, including consumer report cards and surveys. 42 CFR 438.66(e)(2)(vii).",
        },
        {
          type: "heading",
          as: "h4",
          content: "Instructions",
        },
        {
          type: "p",
          children: [
            {
              type: "html",
              content:
                "Starting December 2026, CMS requires states to report this data per calendar year. Moving all states, programs, and plans onto the same reporting timeframe will help standardize data, make it easier to compare, and align it with other CMS systems. To determine which calendar year to use for your report, reference the MCPAR Technical Guidance: Quality Measures (“Technical Guide”) found ",
            },
            {
              type: "externalLink",
              content: "here",
              props: {
                href: "https://www.medicaid.gov/medicaid/managed-care/downloads/MCPAR-Quality-Technical-Guide.docx",
                target: "_blank",
                "aria-label":
                  "MCPAR Quality Technical Guide download (link opens in new tab)",
              },
            },
            {
              type: "html",
              content: " on Medicaid.gov.",
            },
          ],
        },
        {
          type: "heading",
          as: "h4",
          content: "Reporting scope",
        },
        {
          type: "p",
          content:
            "Include the measures that the state uses to evaluate plan performance, including these categories:",
        },
        {
          type: "ol",
          children: [
            {
              type: "li",
              content:
                "Measures included in external quality review activities",
            },
            {
              type: "li",
              content: "Contract-required quality of care measures",
            },
            {
              type: "li",
              content:
                "Plan-Level Measures Used for Determining Plan Incentive or Withhold Payments",
            },
          ],
        },
        {
          type: "p",
          content:
            "Measures will likely fall into more than one of these categories but only need to fall into one category to be required for MCPAR reporting.",
        },
        {
          type: "p",
          children: [
            {
              type: "html",
              content:
                "Depending on how measures are defined, a single measure may be made up of several different “rates” or “sub-measures” (e.g., rates for different age groups, etc.). Where a measure steward has specified several rates, the state should not report all possible rates for the measure in the MCPAR. Instead, follow the decision tree located in Figure 1 of the Technical Guide found ",
            },
            {
              type: "externalLink",
              content: "here",
              props: {
                href: "https://www.medicaid.gov/medicaid/managed-care/downloads/MCPAR-Quality-Technical-Guide.docx",
                target: "_blank",
                "aria-label":
                  "MCPAR Quality Technical Guide download (link opens in new tab)",
              },
            },
            {
              type: "html",
              content:
                " on Medicaid.gov to determine which rates to report under “Naming of Rates.”",
            },
          ],
        },
      ],
    },
  },
  form: { id: "dqmi", fields: [] },
};
