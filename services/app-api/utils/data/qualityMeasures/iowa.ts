import { measureIdentifiers } from "../../constants/constants";
import { Programs } from "../../types";

export const IA: Programs = {
  "Dental Wellness Plan": [
    {
      measure_name: "Access To Any Dental Services",
      measure_identifier: measureIdentifiers.neither,
    },
    {
      measure_name: "Access To Preventative Dental Services",
      measure_identifier: measureIdentifiers.neither,
    },
    {
      measure_name: "Continued Preventive Utilization",
      measure_identifier: measureIdentifiers.neither,
    },
    {
      measure_name: "Encounter Data",
      measure_identifier: measureIdentifiers.neither,
    },
  ],
  "Health Link": [
    {
      measure_name: "Asthma Medication Ratio (HEDIS AMR)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "80",
    },
    {
      measure_name: "Cervical Cancer Screening (HEDIS CCS)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "118",
    },
    {
      measure_name:
        "Follow-Up After Hospitalization For Mental Illness (HEDIS FUH)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "268",
    },
    {
      measure_name: "Prenatal And Postpartum Care (HEDIS PPC)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "581",
    },
  ],
};
