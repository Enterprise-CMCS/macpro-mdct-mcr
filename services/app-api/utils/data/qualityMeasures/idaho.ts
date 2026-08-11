import { measureIdentifiers } from "../../constants/constants";
import { Programs } from "../../types";

export const ID: Programs = {
  "Idaho Smiles": [
    {
      measure_name: "Annual Dental Visit (HEDIS ADV)",
      measure_identifier: measureIdentifiers.no,
      measure_identifierCbe: "1388.0",
    },
    {
      measure_name:
        "Increasing Rates Of Enrollees Accessing Preventative Dental Services",
      measure_identifier: measureIdentifiers.neither,
    },
  ],
  "Idaho Behavioral Health Plan (IBHP)": [
    {
      measure_name: "Plan All-Cause Readmissions (HEDIS PCR)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "561",
    },
    {
      measure_name: "Discharge Coordination- Post Discharge Follow Up",
      measure_identifier: measureIdentifiers.neither,
    },
    {
      measure_name: "Member Satisfaction Survey",
      measure_identifier: measureIdentifiers.neither,
    },
    {
      measure_name:
        "Provider Monitoring And Relations: Provider Quality Monitoring",
      measure_identifier: measureIdentifiers.neither,
    },
  ],
  "Idaho Medicaid Plus (IMP)": [
    {
      measure_name: "Eye Exam for Patients with Diabetes (HEDIS EED)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "203",
    },
    {
      measure_name:
        "Follow Up After Emergency Department Visit For Mental Illness (HEDIS FUM)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "265",
    },
  ],
  "Medicare Medicaid Coordinated Plan (MMCP)": [
    {
      measure_name: "Eye Exam for Patients with Diabetes (HEDIS EED)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "203",
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
  ],
};
