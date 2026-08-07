import { measureIdentifiers } from "../../constants/constants";
import { Programs } from "../../types";

export const VT: Programs = {
  "Vermont Global Commitment to Health": [
    {
      measure_name: "Asthma Medication Ratio (HEDIS AMR)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "80",
    },
    {
      measure_name: "Breast Cancer Screening (HEDIS BCS)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "93",
    },
    {
      measure_name: "Child And Adolescent Well-Care Visits (HEDIS WCV)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "123",
    },
    {
      measure_name: "Chlamydia Screening (HEDIS CHL)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "128",
    },
    {
      measure_name:
        "Diabetes Care For People With Serious Mental Illness: A1c > 9.0% (HEDIS HPCMI)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "196",
    },
    {
      measure_name:
        "Follow Up After Emergency Department Visit For Alcohol & Other Drug Abuse/Dependence (HEDIS FUA)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "264",
    },
    {
      measure_name:
        "Follow Up After Emergency Department Visit For Mental Illness (HEDIS FUM)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "265",
    },
    {
      measure_name:
        "Follow-Up After Hospitalization For Mental Illness (HEDIS FUH)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "268",
    },
    {
      measure_name:
        "Initiation And Engagement Of Substance Use Disorder Treatment (HEDIS IET)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "394",
    },
    {
      measure_name: "Prenatal And Postpartum Care (HEDIS PPC)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "581",
    },
    {
      measure_name:
        "Weight Assessment And Counseling For Children / Adolescents (HEDIS WCC)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "760",
    },
    {
      measure_name: "Well-Child Visits In First 30 Months Of Life (HEDIS W30)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "761",
    },
    {
      measure_name: "Developmental Screening In The First Three Years Of Life",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "1003",
    },
    {
      measure_name:
        "Adults' Access To Preventive/Ambulatory Health Services (HEDIS AAP)",
      measure_identifier: measureIdentifiers.neither,
    },
  ],
};
