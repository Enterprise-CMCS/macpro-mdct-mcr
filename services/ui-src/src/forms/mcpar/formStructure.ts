import { NotFound } from "routes";

export default [
  {
    name: "Test",
    formId: "test",
    path: "/test",
  },
  {
    name: "Get Started",
    path: "/get-started",
    element: NotFound, // TODO: add custom page
  },
  {
    name: "A: Program Information",
    path: "/program-information",
    children: [
      {
        name: "Point of Contact",
        path: "/point-of-contact",
        formId: "apoc",
      },
      {
        name: "Reporting Period",
        path: "/reporting-period",
        formId: "arp",
      },
      {
        name: "Add Plans",
        path: "/add-plans",
        formId: "aap",
      },
      {
        name: "Add BSS Entities",
        path: "/add-bss-entities",
        formId: "absse",
      },
    ],
  },
  {
    name: "B: State-Level Indicators",
    path: "/state-level-indicators",
    children: [
      {
        name: "I: Program Characteristics",
        path: "/program-characteristics",
        formId: "bpc",
      },
      {
        name: "III: Encounter Data Report",
        path: "/encounter-data-report",
        formId: "bedr",
      },
      {
        name: "X: Program Integrity",
        path: "/program-integrity",
        formId: "bpi",
      },
    ],
  },
  {
    name: "C: Program-Level Indicators",
    path: "/program-level-indicators",
    children: [
      {
        name: "I: Program Characteristics",
        path: "/program-characteristics",
        formId: "cpc",
      },
      {
        name: "III: Encounter Data Report",
        path: "/encounter-data-report",
        formId: "cedr",
      },
      {
        name: "IV: Appeals, State Fair Hearings & Grievances",
        path: "/appeals-state-fair-hearings-and-grievances",
        formId: "casfhag",
      },
      {
        name: "V: Availability & Accessibility",
        path: "/availability-and-accessibility",
        children: [
          {
            name: "Network Adequacy",
            path: "/network-adequacy",
            formId: "cna",
          },
          {
            name: "Access Measures",
            path: "/access-measures",
            formId: "cam",
          },
        ],
      },
      {
        name: "IX: BSS",
        path: "/bss",
        formId: "cbss",
      },
      {
        name: "X: Program Integrity",
        path: "/program-integrity",
        formId: "cpi",
      },
    ],
  },
  {
    name: "D: Plan-Level Indicators",
    path: "/plan-level-indicators",
    children: [
      {
        name: "I: Program Characteristics",
        path: "/program-characteristics",
        formId: "dpc",
      },
      {
        name: "II: Financial Performance",
        path: "/financial-performance",
        formId: "dfp",
      },
      {
        name: "III: Encounter Data Report",
        path: "/encounter-data-report",
        formId: "dedr",
      },
      {
        name: "IV: Appeals, State Fair Hearings & Grievances",
        path: "/appeals-state-fair-hearings-and-grievances",
        children: [
          {
            name: "Appeals Overview",
            path: "/appeals-overview",
            formId: "dao",
          },
          {
            name: "Appeals by Service",
            path: "/appeals-by-service",
            formId: "dabs",
          },
          {
            name: "State Fair Hearings",
            path: "/state-fair-hearings",
            formId: "dsfh",
          },
          {
            name: "Grievances Overview",
            path: "/grievances-overview",
            formId: "dgo",
          },
          {
            name: "Grievances by Reason",
            path: "/grievances-by-reason",
            formId: "dgbr",
          },
        ],
      },
      {
        name: "VII: Quality Measures",
        path: "/quality-measures",
        formId: "dqm",
      },
      {
        name: "VIII: Sanctions",
        path: "/sanctions",
        formId: "ds",
      },
      {
        name: "X: Program Integrity",
        path: "/program-integrity",
        formId: "dpi",
      },
    ],
  },
  {
    name: "E: BSS Entity Indicators",
    path: "/bss-entity-indicators",
    formId: "ebssei",
  },
  {
    name: "Review & Submit",
    path: "/review-and-submit",
    element: NotFound, // TODO: add custom page
  },
];
