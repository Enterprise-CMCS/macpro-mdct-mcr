import { FormJson } from "types";

export const generateProgramListFields = (form: FormJson) => {
  const fields = form.fields;

  const programNameOtherText = {
    id: "programName-otherText",
    type: "text",
    validation: "text",
    props: { label: "Specify a new program name" },
  };

  fields.splice(1, 0, programNameOtherText);

  return {
    ...form,
    fields: fields,
  };
};

// ESP: program list (MCPAR)
export const programList = {
  // Alabama
  AL: [
    {
      id: "EIqjAqPHo4tS2geQTeiQrHVz",
      label: "Alabama Coordinated Health Network (ACHN)",
    },
    {
      id: "24KxJzGtP4NxlUJZrhGJKYEf",
      label: "Alabama Integrated Care Network (ICN)",
    },
    // other, specify
    {
      id: "247cNJEIfJ4gbGGrah1e9KPe",
      label: "Other, specify",
    },
  ],
  // Arkansas
  AR: [
    {
      id: "v3YFWjfOyS69iESjUzy5jsxD",
      label: "Provider Led Arkansas Shared Savings Entity (PASSE)",
    },
    {
      id: "zaAyFy8QjFIjkpVtQs7LNCVl",
      label: "Healthy Smiles",
    },
    // other, specify
    {
      id: "BIrw5tf4OvMVIYqYhYElKIvj",
      label: "Other, specify",
    },
  ],
  // Arizona
  AZ: [
    {
      id: "5EjS7L6RPemb5qADp3aw2pG9",
      label: "Arizona Complete Care (ACC)",
    },
    {
      id: "wRaU5JxD4eMYHH5hjYFwDzXR",
      label:
        "Arizona Long-Term Care System Elderly and Physically Disabled (ALTCS-EPD)",
    },
    {
      id: "ToObVfoavqbE69TPSICPmcJI",
      label:
        "Arizona Long-Term Care System Developmentally Disabled (ALTCS-DD)",
    },
    {
      id: "mLhsbQt6FVEcs97UEhCsEDwg",
      label: "Regional Behavioral Health Authority (RBHA)",
    },
    {
      id: "b92Tk23BTj5XbwA9L6Fvh7BC",
      label: "Comprehensive Health Plan (CHP)",
    },
    // other, specify
    {
      id: "w9mYPNHSJeiNrO8tvYUJsfNA",
      label: "Other, specify",
    },
  ],
  // California
  CA: [
    {
      id: "rVCN7urNI7SkpzeFlujE8TZn",
      label: "Dental Managed Care",
    },
    {
      id: "Fd2dPtWxBXfBaamNJxr2sjrO",
      label: "AIDS Healthcare Foundation",
    },
    {
      id: "M2E1tIoBn385OMRwaMkzYQZz",
      label: "Drug MediCal - Organized Delivery System",
    },
    {
      id: "hQrSN2BhHAC9U9yqXH4RXLGn",
      label: "Specialty Mental Health",
    },
    {
      id: "MjfEADVBox5Aotq2idjeft6M",
      label: "Medi-Cal Managed Care program (MCMC)",
    },
    // other, specify
    {
      id: "PrBUaXgaLC4O54zYCfxLlhIJ",
      label: "Other, specify",
    },
  ],
  // Colorado
  CO: [
    {
      id: "gOCHAKMaw4rqO2iUYwCtVlrf",
      label: "Accountable Care Collaborative (ACC)",
    },
    {
      id: "B4JCwLTw9P22TuSu0CNj8HpP",
      label: "Child Health Plan Plus (CHP+)",
    },
    {
      id: "xtGIS3aubFMaiVCtspgb7P0q",
      label: "Child Health Plan Plus (CHP+) Dental Care",
    },
    // other, specify
    {
      id: "JgKDJkKjZIxLzjvHeDHfjPVl",
      label: "Other, specify",
    },
  ],
  // Delaware
  DE: [
    {
      id: "IfwD2YzbQH2aUwZsD1pesohn",
      label: "Delaware State Health Plan/Delaware State Health Plan Plus",
    },
    // other, specify
    {
      id: "lG0y9oZWrw4NbtMLUwzTmqBS",
      label: "Other, specify",
    },
  ],
  // Washington, DC
  DC: [
    {
      id: "fALQyWWaCnvIMyXQzI59b1F9",
      label:
        "Child and Adolescent Supplemental Security Income Program (CASSIP)",
    },
    {
      id: "UWQwYFT5PndXIdGv0yHOo1Mm",
      label: "DC Dual Choice D-SNP",
    },
    {
      id: "MJxbwotStcthpiEg4Byc5KmI",
      label: "District of Columbia Healthy Families Program (DCHFP)",
    },
    // other, specify
    {
      id: "AeNbjlXDRKAXdtjlrXdxVsDs",
      label: "Other, specify",
    },
  ],
  // Florida
  FL: [
    {
      id: "GtPVr3OIOsuwly2q6jRZsGU2",
      label: "MomCare",
    },
    {
      id: "YI4p6xUUkUVA7smiPuc1IPM7",
      label: "D-SNP",
    },
    // other, specify
    {
      id: "a9gUWcBi8mODgLkfZm66klBx",
      label: "Other, specify",
    },
  ],
  // Georgia
  GA: [
    {
      id: "Vs6Hir1djWORvNs8DSthy6pr",
      label: "Georgia Families",
    },
    {
      id: "IAd3zB248HmPVJd03TqJPpey",
      label: "Georgia Families 360",
    },
    {
      id: "EoikrSmwtoquDRTUv4C8V9Ak",
      label: "Planning 4 Healthy Babies (P4HB)",
    },
    {
      id: "jjUAdivEbz7rbobt6Bna3jH0",
      label: "Pathways to Coverage",
    },
    // other, specify
    {
      id: "8FFpjfAe1mRKC4IdlcAevRfB",
      label: "Other, specify",
    },
  ],
  // Hawaii
  HI: [
    {
      id: "dnKjBFbMv3SeGFtx9Y8GMhTe",
      label: "Hawaii's QUEST Integration",
    },
    {
      id: "jHfU3f0ICuHeVeHE00MkCllx",
      label: "Community Care Services",
    },
    // other, specify
    {
      id: "9pAAE81qus7Owcgbg0QZlW4H",
      label: "Other, specify",
    },
  ],
  // Idaho
  ID: [
    {
      id: "gHBsWBrgn1AFataQthoaYmnm",
      label: "Medicare Medicaid Coordinated Plan (MMCP)",
    },
    {
      id: "DTDaMxL8OXHgLg9gLRRN02gX",
      label: "Idaho Medicaid Plus (IMP)",
    },
    {
      id: "xcPLN8yGw6aAkqK4VTUFJHYy",
      label: "Idaho Behavioral Health Plan (IBHP)",
    },
    {
      id: "5BA11vA9v6QDT0j3q3g0DEfb",
      label: "Idaho Smiles",
    },
    // other, specify
    {
      id: "TTyfJoAiJGm1DKPi5MN0ZA2M",
      label: "Other, specify",
    },
  ],
  // Illinois
  IL: [
    {
      id: "WBEu2ygvmGslPecHo9AGonCv",
      label: "HealthChoice Illinois (HCI)",
    },
    {
      id: "fKn31H2YY88dGwTyfrXqHEcm",
      label: "Medicare-Medicaid Alignment Initiative (MMAI)",
    },
    // other, specify
    {
      id: "2hKL4ITbYjGI4RnowcdTGg1k",
      label: "Other, specify",
    },
  ],
  // Indiana
  IN: [
    {
      id: "LNslmT5MsKEMU40sozAxvBVr",
      label: "Healthy Indiana Plan (HIP)",
    },
    {
      id: "sWF52qP8GO6848hunxl0EL9W",
      label: "Hoosier Care Connect (HCC)",
    },
    {
      id: "EclDc6a3V2AMynlgURas8OCx",
      label: "Hoosier HealthWise (HHW)",
    },
    {
      id: "SVQtk1ZRIUTfioK9fOl9ikCU",
      label: "Pathways for Aging",
    },
    // other, specify
    {
      id: "3jkELWHRR6bpSr2kqGopq0c4",
      label: "Other, specify",
    },
  ],
  // Iowa
  IA: [
    {
      id: "JYMLHctuTITLQSYINNPhDbaO",
      label: "Health Link",
    },
    {
      id: "AIRheUY1geIqiumKruePsmJK",
      label: "Dental Wellness Plan",
    },
    {
      id: "B4fFkG4xYiUS3RAf0azA1btz",
      label: "CHIP Hawki - Dental",
    },
    // other, specify
    {
      id: "Slz6waXtSxBSv714jhxivE7U",
      label: "Other, specify",
    },
  ],
  // Kansas
  KS: [
    {
      id: "rOuZXLtZnmHwwKdVi6Gf6Fx6",
      label: "KanCare",
    },
    // other, specify
    {
      id: "Frq92tjO6oYFxzoynPpUgFvr",
      label: "Other, specify",
    },
  ],
  // Kentucky
  KY: [
    {
      id: "OjOZW0vISP2monSyFzoEmEKo",
      label: "Kentucky Managed Care Organization Program (KYMCO)",
    },
    // other, specify
    {
      id: "Ynlwo3AGRjcFLwloMwLbVK8g",
      label: "Other, specify",
    },
  ],
  // Louisiana
  LA: [
    {
      id: "AyJwP3j6AajNBQ2SfXx2pI9D",
      label: "Healthy Louisiana",
    },
    {
      id: "bNWq7iTImJo7fdpWxFdGX0EB",
      label: "Dental Benefit Program (DBP)",
    },
    {
      id: "eNURfrWCAVqJsKD8GHBgBnJ7",
      label: "Healthy Louisiana Coordinated System of Care Program (CSoC)",
    },
    // other, specify
    {
      id: "FunB5i9r5lLQL0c7dts8FCWD",
      label: "Other, specify",
    },
  ],
  // Maine
  ME: [
    {
      id: "HwE48AXxXf6eSHZc7qYlpyYK",
      label: "Maine Non-Emergency Transportation (NET) Program",
    },
    {
      id: "W2DGFiCmeXM7WuRhz6ugQNKg",
      label: "Accountable Communities",
    },
    // other, specify
    {
      id: "d3YIc84MrhySa0Ghnkv9ZgBr",
      label: "Other, specify",
    },
  ],
  // Maryland
  MD: [
    {
      id: "yoAMiHu0i2T0lg4SNCvJSdrU",
      label: "HealthChoice",
    },
    // other, specify
    {
      id: "Bbc7nGA6L1neBMLLqX7jeKng",
      label: "Other, specify",
    },
  ],
  // Massachusetts
  MA: [
    {
      id: "mZDZkUqIJTzVsYqWwUkCpxDe",
      label: "Accountable Care Organization Partnership Plan (ACPP)",
    },
    {
      id: "Lxw9iYNsQ5msQrzCo9YPYFg0",
      label: "Senior Care Options (SCO)",
    },
    {
      id: "LlIehwl4PaaWTGKYtRuFtpa8",
      label: "MCO Program",
    },
    {
      id: "fIhvUbnPlwMi6h4Y0Mkb7WXX",
      label:
        "Primary Care Accountable Care Organization (Primary Care ACO or PCACO)",
    },
    {
      id: "8tTtPlLsxV5mX6RQ4iKJtrLr",
      label: "BH/SUD PIHP (Massachusetts Behavioral Health Partnership (MBHP))",
    },
    {
      id: "NeHtD99KiHVS2ZUWnUqfwBtO",
      label: "One Care",
    },
    // other, specify
    {
      id: "TzQ5gXHd447kShbv5O5vPvzz",
      label: "Other, specify",
    },
  ],
  // Michigan
  MI: [
    {
      id: "rKP1AuYdyVplrfjL771Q6CMb",
      label: "Healthy Kids Dental (HKD)",
    },
    {
      id: "I8Y6rQy4CjpVF7F7Lc3QzVEA",
      label: "MI Choice",
    },
    {
      id: "lH6nmhqusWyOMPyGao7mmhAB",
      label: "Managed Specialty Services & Supports",
    },
    {
      id: "020MTjgJZbMDf3uM3XHa6Zlb",
      label: "Comprehensive Health Care Program (CHCP)",
    },
    {
      id: "9j6moQolrYNkCzmzqsQKNBAg",
      label: "Health Link",
    },
    // other, specify
    {
      id: "wlQSt4zWT4acJulURMXhO1BV",
      label: "Other, specify",
    },
  ],
  // Minnesotta
  MN: [
    {
      id: "g3YiOeqUorkj8RKxZiGqdF1h",
      label: "Minnesota Senior Health Options (MSHO)",
    },
    {
      id: "Kvaa1JvEIoT1Vl15InEUjIOy",
      label: "PMAP",
    },
    {
      id: "i6sIFm9OSGx8aOokpsZRrK2C",
      label: "Special Needs Basic Care (SNBC)",
    },
    {
      id: "axtdsWz0pbF76hqgUOTThs7C",
      label: "Minnesota Senior Care Plus (MSC+)",
    },
    {
      id: "YdKa3xY2iqdVAsQfHd7O5g6Y",
      label: "MinnesotaCare",
    },
    // other, specify
    {
      id: "nAGVeiiax5tzBO7L9yOzkBu7",
      label: "Other, specify",
    },
  ],
  // Mississippi
  MS: [
    {
      id: "VmtV1Hv3OPaAztVuKv42tjCk",
      label: "Mississippi Coordinated Access Network (MississippiCAN)",
    },
    {
      id: "DmMnEfc3LDjokVJyWmydH1gU",
      label: "MississippiCHIP",
    },
    // other, specify
    {
      id: "TnGgtIH1QJxMOyAGcSTsDnra",
      label: "Other, specify",
    },
  ],
  // Missouri
  MO: [
    {
      id: "fhnimink8wMG8YFKnSJFb9I7",
      label: "MO HealthNet Managed Care Plan",
    },
    // other, specify
    {
      id: "2abumz9gJgrCavYxBkt3E0Br",
      label: "Other, specify",
    },
  ],
  // Montana
  MT: [
    {
      id: "Ykf5e7509dBfwaWu3ywQOctb",
      label: "Tribal Health Improvement Plan (T-HIP)",
    },
    // other, specify
    {
      id: "JaNWTNww6BjaMWBdWb6kZ0qr",
      label: "Other, specify",
    },
  ],
  // Nebraska
  NE: [
    {
      id: "MLPFoImu6FrjJJpcG9v2t9Pp",
      label: "Heritage Health",
    },
    {
      id: "cr3LVfku8XlI5No4OyntQnu0",
      label: "CHIP",
    },
    {
      id: "HLIEvPjm8smRb4qZNTGHQ2lE",
      label: "Substance Use Disorder Program",
    },
    // other, specify
    {
      id: "BLpoHHgEADpIPNnUv7lDygIN",
      label: "Other, specify",
    },
  ],
  // Nevada
  NV: [
    {
      id: "qCWS3fLpyXOEvwBeS37obe0J",
      label: "Dental Benefits Administration Program (DBA)",
    },
    {
      id: "qOMotuAh8DiLqfSOJz0JEyJS",
      label: "Nevada Mandatory Health Maintenance Program",
    },
    // other, specify
    {
      id: "G16VkXOiJywLDqwHhLiHKHxL",
      label: "Other, specify",
    },
  ],
  // New Hampshire
  NH: [
    {
      id: "trskQUyjE3a2uvYhxBenjPvl",
      label: "Medicaid Care Management (MCM)",
    },
    {
      id: "OotA1OCKTrbmyA6eZUJ1DGqj",
      label: "MCM-Dental Services",
    },
    // other, specify
    {
      id: "vzofKeWUJgsceFrRAUAdDdJn",
      label: "Other, specify",
    },
  ],
  // New Jersey
  NJ: [
    {
      id: "2UCpnNYg5DLmKJI089NeKthU",
      label: "FIDE-SNP-Duals",
    },
    {
      id: "8w3Kx3PmRyYrL7kDJJXX78II",
      label: "NJ Family Care MLTSS",
    },
    {
      id: "9m5aU8E4zOp7l3hL0XVHRlXy",
      label: "NJ Family Care Acute Care",
    },
    // other, specify
    {
      id: "m5Qv4mif4YMvJyivXUXVnqDu",
      label: "Other, specify",
    },
  ],
  // New Mexico
  NM: [
    {
      id: "eKwjZtIioFxg9mdrO1gA8Ymo",
      label: "New Mexico Turquoise Care",
    },
    // other, specify
    {
      id: "dZAV7nlbFhZSGkk7ANWdk5RJ",
      label: "Other, specify",
    },
  ],
  // New York
  NY: [
    {
      id: "yLC2ONYWuyUY4nP3dHhxyTj2",
      label: "Behavioral Health and Recovery Plan (HARP)",
    },
    {
      id: "VtDtt5Oi1aL0C83I8J1L0k7K",
      label: "Managed Long Term Care Partial Cap (MLTC)",
    },
    {
      id: "qWnUXf4GjHtLb5pANB0R0moL",
      label: "Medicaid Advantage Plus (MAP)",
    },
    {
      id: "DXphgy0JLdIo0Tquc5wOLBwB",
      label: "HIV Special Needs Plan (HIV SNP)",
    },
    {
      id: "MY9YSHhax4MxreBkKcx0vyci",
      label:
        "Fully Integrated Duals Advantage for Individuals with Intellectual & Developmental Disabilities (FIDA-IDD)",
    },
    {
      id: "PoUqzdCA7hzGx2kKOCHEPMQn",
      label: "Mainstream Managed Care (MMC)",
    },
    // other, specify
    {
      id: "HVfMP7YgVf9iTIkrH1jK13f3",
      label: "Other, specify",
    },
  ],
  // North Carolina
  NC: [
    {
      id: "kANrY8P11CnhhemLZigpWors",
      label: "Community Care of North Carolina (CCNC)",
    },
    {
      id: "R5SmBcfye0cceFIQQf8MwGVk",
      label: "Eastern Band of Cherokee Indians (EBCI) Tribal Option",
    },
    {
      id: "IUkIdmITkjXdHceZnCI8d1P3",
      label: "Medicaid Direct Behavioral Health",
    },
    {
      id: "lh3WCIxBQOtenlb6YBSt3T5G",
      label: "Standard Plan",
    },
    {
      id: "hdWxSgcjxFcA34W5YnrGO4JE",
      label: "BH I/DD Tailored Plan",
    },
    // other, specify
    {
      id: "POAdAMCEaDqZmMEluT7pz3bF",
      label: "Other, specify",
    },
  ],
  // North Dakota
  ND: [
    {
      id: "qnh3FrWp7qUnReQLr8Asb7Rt",
      label: "ND Medicaid Expansion",
    },
    // other, specify
    {
      id: "QJbJxyKEXRfTTON1U1qCyny0",
      label: "Other, specify",
    },
  ],
  // Ohio
  OH: [
    {
      id: "o549cIUcz09qCovJ7xNegt3s",
      label: "MyCare Ohio, Ohio's Integrated Care Delivery System (MCOP)",
    },
    {
      id: "zE4g0MnKyum6ghJudwiqRiWo",
      label: "Ohio Medicaid Managed Care Program (MMC)",
    },
    {
      id: "OvZP8eoV2y9UmW9W0bOPAl7u",
      label: "Single Pharmacy Benefit Manager (SBPM)",
    },
    {
      id: "fzzOnYSm5xvGrr7h3qXhXV2g",
      label: "Ohio RISE (Resilience through Integrated Systems and Excellence)",
    },
    // other, specify
    {
      id: "Ts4tJlYZ1mUBFLIBhuzdY9Xr",
      label: "Other, specify",
    },
  ],
  // Oklahoma
  OK: [
    {
      id: "MNooqHYaV7few6V1zgNNMu8s",
      label: "SoonerSelect Children's Specialty Program (CSP)",
    },
    {
      id: "p9Z49lliZnUnkYzxsKjEnFlA",
      label: "SoonerSelect Medical",
    },
    {
      id: "xXGZkdQpblavQztQwUE8kS86",
      label: "SoonerCare Choice",
    },
    // other, specify
    {
      id: "RDJGPAEu0F2lft21vKoiI2Bf",
      label: "Other, specify",
    },
  ],
  // Oregon
  OR: [
    {
      id: "yHtx2dBNpIHLoUAFPUSw5ln4",
      label: "Coordinated Care Organization (CCO)",
    },
    // other, specify
    {
      id: "uhnoVUgjae0a6FnKIS44V2tE",
      label: "Other, specify",
    },
  ],
  // Pennsylvania
  PA: [
    {
      id: "FfRFqER02jgFaK9lEcWiHzFb",
      label: "Physical Health HealthChoices (PH-HC)",
    },
    {
      id: "5QOSrEpZfJJeuPJU9vrinMjW",
      label: "Behavioral Health HealthChoices (BH-HC)",
    },
    {
      id: "tm1V6rhCHt9sq5aKPadu3Bia",
      label: "Community HealthChoices (CHC)",
    },
    {
      id: "l0xMakS2qBpApIjIvolMtvbd",
      label: "Adult Community Autism Program (ACAP)",
    },
    {
      id: "GEAeHfhMrDPZpjeDW2pkiOs7",
      label: "Children's Health Insurance Program (CHIP)",
    },
    // other, specify
    {
      id: "S9RQCg9c2vmw2ekZxIjQPpzH",
      label: "Other, specify",
    },
  ],
  // Puerto Rico
  PR: [
    {
      id: "Q0y0OEd8RM3abELHmfF4bXRh",
      label: "Platino: Dual-Special Needs Plan (D-SNP)",
    },
    {
      id: "AYc3s2y30BFQZoLlvR1enLDX",
      label: "The Vital Government Health Plan",
    },
    // other, specify
    {
      id: "QOOtQNdwnwi8WjsySmJTSBKX",
      label: "Other, specify",
    },
  ],
  // Rhode Island
  RI: [
    {
      id: "TU3Zhb1IuZud7l0UUYg8vUrI",
      label: "RIteCare MCO",
    },
    {
      id: "Xk1M34EhUSO1BblZC8ii1qNF",
      label: "RIteSmiles",
    },
    {
      id: "XtLKxy0BCUkuJMwUOb7UaOw8",
      label: "Rhode Island Integrated Care Initiative",
    },
    // other, specify
    {
      id: "FnSHq6bTkdFosmrE3YpSGGvw",
      label: "Other, specify",
    },
  ],
  // South Carolina
  SC: [
    {
      id: "vAYRx4Gib5WLLEzZ6aXbxMzA",
      label: "Healthy Connections Choices",
    },
    {
      id: "lsRPa82TNqiTCiD9n56RXflS",
      label: "Healthy Connections Prime",
    },
    // other, specify
    {
      id: "Yq8Kpj8NnoIXJDXrA4sTHWPI",
      label: "Other, specify",
    },
  ],
  // Tennessee
  TN: [
    {
      id: "RJIvS7tBNKYmEPN2lmMjxSXn",
      label: "TennCare",
    },
    {
      id: "jbggcYz5el7obt3Zbw5Jp0t8",
      label: "TennCare Select",
    },
    {
      id: "XVltP7POUgr95mlkZpXr9r3v",
      label: "Adult Dental Program",
    },
    {
      id: "mPtbliMlZ938gISzXR8in70S",
      label: "CoverKids Program",
    },
    // other, specify
    {
      id: "54HRrTaLqhmkXCYdo2IIDyhd",
      label: "Other, specify",
    },
  ],
  // Texas
  TX: [
    {
      id: "PtkXLdtfms2k93IqQkwORg2r",
      label: "STAR Health",
    },
    {
      id: "iRHocpaY5XvnVxZHH31J4ZWC",
      label: "STAR Kids",
    },
    {
      id: "BEbOycQSMxiLxoH3QoXIEA2g",
      label: "STAR",
    },
    {
      id: "PTO3vZY3dpGCV3TYgK3GmagR",
      label: "Dental (Children's Medicaid Dental Services)",
    },
    {
      id: "jna4N2cB18lPBmR83twxbYU8",
      label: "Dual Demonstration Program",
    },
    {
      id: "rjAHRGiCmEUGK8H5A7YLoCud",
      label: "STAR+PLUS",
    },
    // other, specify
    {
      id: "Mv29dEFxyQuLOAoqxWR74W0I",
      label: "Other, specify",
    },
  ],
  // Utah
  UT: [
    {
      id: "dMY7YePxerwyDIBcZNqRSzwo",
      label: "Utah Healthy Outcomes for Medical Excellence (HOME)",
    },
    {
      id: "ajJfzN52qZ9n18yrYMpAJPXJ",
      label: "UT Medicaid Dental",
    },
    {
      id: "lZM0Ux8MwzsaGcIiqf6GeGJe",
      label: "UT Prepaid Mental Health Plan",
    },
    {
      id: "of1IqqdUitWpL8B6fP9h49Fi",
      label: "Utah Medicaid Integrated Counties (UMIC)",
    },
    {
      id: "PYeSbQy8wz26GQUukofUjFoS",
      label: "UT ACO",
    },
    {
      id: "pG8qB66wy1cSauuc0sCGC7et",
      label: "UT CHIP Dental",
    },
    // other, specify
    {
      id: "kGoq70Kc69j6MTR2mWSkuqI9",
      label: "Other, specify",
    },
  ],
  // Vermont
  VT: [
    {
      id: "opuhRIuGgj3pLNNCEDOZLNuv",
      label: "Vermont Global Commitment to Health",
    },
    // other, specify
    {
      id: "xkOogq4Rs2m9QLnaP7j3YAtP",
      label: "Other, specify",
    },
  ],
  // Virginia
  VA: [
    {
      id: "lhgkAzmUxkKBRJpnTL1gwkoP",
      label: "Cardinal Care Managed Care",
    },
    // other, specify
    {
      id: "SKCuV62OFqEUekRCVpd5DSFa",
      label: "Other, specify",
    },
  ],
  // Washington
  WA: [
    {
      id: "i0qV5Y7MpOtHHfarqqZNEaVI",
      label: "Apple Health Integrated Managed Care (IMC)",
    },
    {
      id: "gojlp1XdVf14cGqHVj7JFrsZ",
      label: "Integrated Foster Care (IFC)",
    },
    {
      id: "F5NiWADoBRlwatzj375oMwGq",
      label: "Behavioral Health Only Services (BHSO)",
    },
    // other, specify
    {
      id: "r8mzhFiVZOe0DSCic74Z8Zu7",
      label: "Other, specify",
    },
  ],
  // West Virginia
  WV: [
    {
      id: "bE1lVFcULXGQLQEgHeMNFZYw",
      label: "Mountain Health Trust (MHT)",
    },
    {
      id: "87QUwToKBG7WOttbewx45cqc",
      label: "Mountain Heath Promise (MHP)",
    },
    {
      id: "ns6glVkHfwAKeOMQ2vXhcEFD",
      label: "WVCHIP (WVCHIP)",
    },
    // other, specify
    {
      id: "FxxDiMjpwH2InXkXQdsbG84s",
      label: "Other, specify",
    },
  ],
  // Wisconsin
  WI: [
    {
      id: "mzGvJmaG5Przlu0CfpfTxDYk",
      label: "Care 4 Kids",
    },
    {
      id: "o2ZilmecPMCmcXGgWXoFtFyD",
      label: "BadgerCare Plus (BCP)",
    },
    {
      id: "jRU1SSVvTWgOiNgBsteRou0K",
      label: "Family Care",
    },
    {
      id: "FvhGkHOthXkiZFroG4X5JmD6",
      label: "Family Care Partnership",
    },
    {
      id: "pKMy2Ws5IT2iInUxfBd1e1LB",
      label: "SSI Managed Care (SSI)",
    },
    // other, specify
    {
      id: "OkAVCgeSGs7qDhcpJdVxSwbO",
      label: "Other, specify",
    },
  ],
  // Wyoming
  WY: [
    {
      id: "chzp3SWGykXBcYPiuKomisN7",
      label: "Wyoming Medicaid's Care Management Entity (CME)",
    },
    // other, specify
    {
      id: "LuC43h8VZxCsYVRlhb8y8DdD",
      label: "Other, specify",
    },
  ],
};
