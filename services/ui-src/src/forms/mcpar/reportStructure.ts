import React from "react";
import { NotFound } from "routes";

export default [
  {
    name: "Test",
    formId: "test",
    path: "/mcpar/test",
  },
  {
    name: "Get Started",
    path: "/mcpar/get-started",
    element: React.createElement(NotFound), // TODO: add custom page
  },
  {
    name: "A: Program Information",
    path: "/mcpar/program-information",
    children: [
      {
        name: "Point of Contact",
        path: "/mcpar/program-information/point-of-contact",
        formId: "apoc",
      },
      {
        name: "Reporting Period",
        path: "/mcpar/program-information/reporting-period",
        formId: "arp",
      },
      {
        name: "Add Plans",
        path: "/mcpar/program-information/add-plans",
        formId: "aap",
      },
      {
        name: "Add BSS Entities",
        path: "/mcpar/program-information/add-bss-entities",
        formId: "absse",
      },
    ],
  },
  {
    name: "B: State-Level Indicators",
    path: "/mcpar/state-level-indicators",
    children: [
      {
        name: "I: Program Characteristics",
        path: "/mcpar/state-level-indicators/program-characteristics",
        formId: "bpc",
      },
      {
        name: "III: Encounter Data Report",
        path: "/mcpar/state-level-indicators/encounter-data-report",
        formId: "bedr",
      },
      {
        name: "X: Program Integrity",
        path: "/mcpar/state-level-indicators/program-integrity",
        formId: "bpi",
      },
    ],
  },
  {
    name: "C: Program-Level Indicators",
    path: "/mcpar/program-level-indicators",
    children: [
      {
        name: "I: Program Characteristics",
        path: "/mcpar/program-level-indicators/program-characteristics",
        formId: "cpc",
      },
      {
        name: "III: Encounter Data Report",
        path: "/mcpar/program-level-indicators/encounter-data-report",
        formId: "cedr",
      },
      {
        name: "IV: Appeals, State Fair Hearings & Grievances",
        path: "/mcpar/program-level-indicators/appeals-state-fair-hearings-and-grievances",
        formId: "casfhag",
      },
      {
        name: "V: Availability & Accessibility",
        path: "/mcpar/program-level-indicators/availability-and-accessibility",
        children: [
          {
            name: "Network Adequacy",
            path: "/mcpar/program-level-indicators/availability-and-accessibility/network-adequacy",
            formId: "cna",
          },
          {
            name: "Access Measures",
            path: "/mcpar/program-level-indicators/availability-and-accessibility/access-measures",
            formId: "cam",
          },
        ],
      },
      {
        name: "IX: BSS",
        path: "/mcpar/program-level-indicators/bss",
        formId: "cbss",
      },
      {
        name: "X: Program Integrity",
        path: "/mcpar/program-level-indicators/program-integrity",
        formId: "cpi",
      },
    ],
  },
  {
    name: "D: Plan-Level Indicators",
    path: "/mcpar/plan-level-indicators",
    children: [
      {
        name: "I: Program Characteristics",
        path: "/mcpar/plan-level-indicators/program-characteristics",
        formId: "dpc",
      },
      {
        name: "II: Financial Performance",
        path: "/mcpar/plan-level-indicators/financial-performance",
        formId: "dfp",
      },
      {
        name: "III: Encounter Data Report",
        path: "/mcpar/plan-level-indicators/encounter-data-report",
        formId: "dedr",
      },
      {
        name: "IV: Appeals, State Fair Hearings & Grievances",
        path: "/mcpar/plan-level-indicators/appeals-state-fair-hearings-and-grievances",
        children: [
          {
            name: "Appeals Overview",
            path: "/mcpar/plan-level-indicators/appeals-state-fair-hearings-and-grievances/appeals-overview",
            formId: "dao",
          },
          {
            name: "Appeals by Service",
            path: "/mcpar/plan-level-indicators/appeals-state-fair-hearings-and-grievances/appeals-by-service",
            formId: "dabs",
          },
          {
            name: "State Fair Hearings",
            path: "/mcpar/plan-level-indicators/appeals-state-fair-hearings-and-grievances/state-fair-hearings",
            formId: "dsfh",
          },
          {
            name: "Grievances Overview",
            path: "/mcpar/plan-level-indicators/appeals-state-fair-hearings-and-grievances/grievances-overview",
            formId: "dgo",
          },
          {
            name: "Grievances by Reason",
            path: "/mcpar/plan-level-indicators/appeals-state-fair-hearings-and-grievances/grievances-by-reason",
            formId: "dgbr",
          },
        ],
      },
      {
        name: "VII: Quality Measures",
        path: "/mcpar/plan-level-indicators/quality-measures",
        formId: "dqm",
      },
      {
        name: "VIII: Sanctions",
        path: "/mcpar/plan-level-indicators/sanctions",
        formId: "ds",
      },
      {
        name: "X: Program Integrity",
        path: "/mcpar/plan-level-indicators/program-integrity",
        formId: "dpi",
      },
    ],
  },
  {
    name: "E: BSS Entity Indicators",
    path: "/mcpar/bss-entity-indicators",
    formId: "ebssei",
  },
  {
    name: "Review & Submit",
    path: "/mcpar/review-and-submit",
    element: React.createElement(NotFound), // TODO: add custom page
  },
];
