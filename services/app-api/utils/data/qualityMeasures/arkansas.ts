import { measureIdentifiers } from "../../constants/constants";
import { Programs } from "../../types";

export const AR: Programs = {
  "Provider Led Arkansas Shared Savings Entity (PASSE)": [
    {
      measure_name: "Care Coordinator Caseload",
      measure_identifier: measureIdentifiers.neither,
    },
    {
      measure_name: "Care Coordinator Initial Contact",
      measure_identifier: measureIdentifiers.neither,
    },
    {
      measure_name: "Follow-Up Care",
      measure_identifier: measureIdentifiers.neither,
    },
    {
      measure_name: "Monthly Contact With Enrolled Member",
      measure_identifier: measureIdentifiers.neither,
    },
    {
      measure_name: "Primary Care Provider Assignment",
      measure_identifier: measureIdentifiers.neither,
    },
    {
      measure_name: "Quarterly Contact With Enrolled Member",
      measure_identifier: measureIdentifiers.neither,
    },
  ],
  "Healthy Smiles": [
    {
      measure_name: "Sealant Receipt On Permanent First Molars",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "830",
    },
    {
      measure_name: "Topical Fluoride For Children (HEDIS TFC)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "1672",
    },
    {
      measure_name: "Dental Emergencies",
      measure_identifier: measureIdentifiers.neither,
    },
    {
      measure_name: "Oral evaluation dental services: Adult",
      measure_identifier: measureIdentifiers.neither,
    },
    {
      measure_name: "Oral evaluation dental services: Child (under age 21)",
      measure_identifier: measureIdentifiers.neither,
    },
  ],
};
