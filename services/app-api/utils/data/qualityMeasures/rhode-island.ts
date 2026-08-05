import { measureIdentifiers } from "../../constants/constants";
import { Programs } from "../../types";

export const RI: Programs = {
  "Medicaid Managed Care Program (Rhode Island)": [
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
        "Follow-Up After Hospitalization For Mental Illness (HEDIS FUH)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "268",
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
    {
      measure_name:
        "Glycemic Status Assessment for Patients With Diabetes (HEDIS GSD)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "1820",
    },
  ],
  "RIteSmiles Program (Rhode Island)": [
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
    {
      measure_name:
        "Total Eligibles Receiving Preventive Dental Services (CMS 416 Line 12b)",
      measure_identifier: measureIdentifiers.neither,
    },
  ],
};
