import { measureIdentifiers } from "../../constants/constants";
import { Programs } from "../../types";

export const FL: Programs = {
  "Statewide Medicaid Managed Care - Dental": [
    {
      measure_name: "Sealant Receipt On Permanent First Molars (HEDIS SFM)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "830",
    },
    {
      measure_name:
        "Children Who Receive A Comprehensive Or Periodic Oral Evaluation (HEDIS OED)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "897",
    },
    {
      measure_name: "Topical Fluoride For Children (HEDIS TFC)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "1672",
    },
  ],
  "Statewide Medicaid Managed Care - MMA": [
    {
      measure_name: "Antidepressant Medication Management (HEDIS AMM)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "63",
    },
    {
      measure_name: "Asthma Medication Ratio (HEDIS AMR)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "80",
    },
    {
      measure_name: "Child And Adolescent Well-Care Visits (HEDIS WCV)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "123",
    },
    {
      measure_name: "CAHPS HP - CCC",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "151",
    },
    {
      measure_name: "CAHPS HP - Child",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "151",
    },
    {
      measure_name: "CAHPS HP - Child: Self-Reported Overall Health",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "151",
    },
    {
      measure_name:
        "CAHPS HP - Child: Self-Reported Overall Mental Or Emotional Health",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "151",
    },
    {
      measure_name: "CAHPS HP - Adult",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "152",
    },
    {
      measure_name: "CAHPS HP - Adult: Self-Reported Overall Health",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "152",
    },
    {
      measure_name:
        "CAHPS HP - Adult: Self-Reported Overall Mental Or Emotional Health",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "152",
    },
    {
      measure_name: "CAHPS HP - Adult: Annual Flu Vaccine",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "259",
    },
    {
      measure_name:
        "CAHPS HP - Adult: Medical Assistance With Smoking and Tobacco Use Cessation",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "432",
    },
    {
      measure_name: "Prenatal And Postpartum Care (HEDIS PPC)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "581",
    },
  ],
  "LTC Plus": [
    {
      measure_name: "Comprehensive Assessment and Update (MLTSS-1)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "960",
    },
    {
      measure_name:
        "LTSS Comprehensive Person-Centered Plan and Update (MLTSS-2)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "961",
    },
    {
      measure_name:
        "Shared Person-Centered Plan with Primary Care Provider (MLTSS-3)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "963",
    },
  ],
};
