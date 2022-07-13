export default [
  {
    name: "Get Started",
    path: "/get-started",
  },
  {
    name: "A: Program Information",
    path: "/program-information",
    children: [
      {
        name: "Point of Contact",
        path: "/point-of-contact",
      },
      {
        name: "Reporting Period",
        path: "/reporting-period",
      },
      { name: "Add Plans", path: "/add-plans" },
      {
        name: "Add BSS Entities",
        path: "/add-bss-entities",
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
      },
      {
        name: "III: Encounter Data Report",
        path: "/encounter-data-report",
      },
      {
        name: "X: Program Integrity",
        path: "/program-integrity",
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
      },
      {
        name: "III: Encounter Data Report",
        path: "/encounter-data-report",
      },
      {
        name: "IV: Appeals, State Fair Hearings & Grievances",
        path: "/appeals-state-fair-hearings-and-grievances",
      },
      {
        name: "V: Availability & Accessibility",
        path: "/availability-and-accessibility",
        children: [
          {
            name: "Network Adequacy",
            path: "/network-adequacy",
          },
          {
            name: "Access Measures",
            path: "/access-measures",
          },
        ],
      },
      {
        name: "IX: BSS",
        path: "/bss",
      },
      {
        name: "X: Program Integrity",
        path: "/program-integrity",
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
      },
      {
        name: "II: Financial Performance",
        path: "/financial-performance",
      },
      {
        name: "III: Encounter Data Report",
        path: "/encounter-data-report",
      },
      {
        name: "IV: Appeals, State Fair Hearings & Grievances",
        path: "/appeals-state-fair-hearings-and-grievances",
        children: [
          {
            name: "Appeals Overview",
            path: "/appeals-overview",
          },
          {
            name: "Appeals by Service",
            path: "/appeals-by-service",
          },
          {
            name: "State Fair Hearings",
            path: "/state-fair-hearings",
          },
          {
            name: "Grievances Overview",
            path: "/grievances-overview",
          },
          {
            name: "Grievances by Reason",
            path: "/grievances-by-reason",
          },
        ],
      },
      {
        name: "VII: Quality Measures",
        path: "/quality-measures",
      },
      {
        name: "VIII: Sanctions",
        path: "/sanctions",
      },
      {
        name: "X: Program Integrity",
        path: "/program-integrity",
      },
    ],
  },
  { name: "E: BSS Entity Indicators", path: "/bss-entity-indicators" },
  { name: "Review & Submit", path: "/review-and-submit" },
];
