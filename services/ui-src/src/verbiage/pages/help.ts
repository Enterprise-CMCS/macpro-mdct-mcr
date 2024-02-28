export default {
  intro: {
    header: "How can we help you?",
    body: "Question or feedback? Please email us and we will respond as soon as possible. You can also review our frequently asked questions below.",
  },
  cards: [
    {
      icon: "settings",
      body: "For technical support and login issues: ",
      email: {
        address: "mdct_help@cms.hhs.gov",
      },
    },
    {
      icon: "spreadsheet",
      body: "For support on the MCPAR and NAAAR reports, including questions about policy:",
      email: {
        address: "ManagedCareTA@cms.hhs.gov",
      },
    },
    {
      icon: "spreadsheet",
      body: "For support on the MLR report, including questions about policy:",
      email: {
        address: "DMCPMLR@cms.hhs.gov",
      },
    },
  ],
  accordionItems: [
    {
      question: "MCPAR: Primary Care Case Management Entity (PCCM-E) reports",
      answer: [
        {
          type: "text",
          as: "span",
          content:
            "States are only required to report certain sections of the MCPAR for Primary Care Case Management Entities (PCCM-Es). These include Program Information, Enrollment and Service Expansions as well as Sanctions (see ",
        },
        {
          type: "externalLink",
          content: "42 CFR 438.66(e)(2)(iii)",
          props: {
            href: "https://www.ecfr.gov/current/title-42/part-438/section-438.66#p-438.66(e)(2)(iii)",
            target: "_blank",
            "aria-label": "42 CFR 438.66(e)(2)(iii) (link opens in new tab)",
          },
        },
        {
          type: "text",
          as: "span",
          content: " and ",
        },
        {
          type: "externalLink",
          content: "(viii)",
          props: {
            href: "https://www.ecfr.gov/current/title-42/part-438/section-438.66#p-438.66(e)(2)(viii)",
            target: "_blank",
            "aria-label": "42 CFR 438.66(e)(2)(viii) (link opens in new tab)",
          },
        },
        {
          type: "text",
          as: "span",
          content: ").",
        },
        {
          type: "html",
          content: "<br></br>",
        },
        {
          type: "text",
          as: "p",
          content:
            "Please follow these section-by-section instructions for PCCM-Es:",
        },
        {
          type: "html",
          content: "<br>",
        },
        {
          type: "ul",
          content: "",
          children: [
            {
              type: "li",
              children: [
                {
                  type: "html",
                  content:
                    "<span>In <b>section A.7, Program Information</b>, write the name of the PCCM-E as the Plan.</span><br></br>",
                },
              ],
            },
            {
              type: "li",
              children: [
                {
                  type: "html",
                  content:
                    "<span>In <b>section C1.I.3 Topic 1, Program Characteristics</b>, the radio button for PCCM-E will be pre-selected.</span><br></br>",
                },
              ],
            },
            {
              type: "li",
              children: [
                {
                  type: "html",
                  content:
                    "<span>In <b>section D.VIII, Sanctions</b>, PCCM-Es should describe sanctions the state has issued against the PCCM-E itself.</span><br></br>",
                },
              ],
            },
            {
              type: "li",
              children: [
                {
                  type: "span",
                  content:
                    "Report all known actions across the following domains: sanctions, administrative penalties, corrective action plans, other. Include any pending or unresolved actions.",
                },
              ],
            },
          ],
        },
        {
          type: "html",
          content: "<br>",
        },
        {
          type: "text",
          as: "b",
          content: "Please note:",
        },
        {
          type: "text",
          as: "span",
          content:
            " States can voluntarily report additional information about their PCCM-Es beyond the designated sections in the PCCM-E specific form. If a state wants to report additional information, please contact ",
        },
        {
          type: "externalLink",
          content: "ManagedCareTA@cms.hhs.gov",
          props: {
            href: "mailto:ManagedCareTA@cms.hhs.gov",
            target: "_blank",
            "aria-label": "Mail to ManagedCareTA@cms.hhs.gov",
          },
        },
      ],
    },
  ],
};
