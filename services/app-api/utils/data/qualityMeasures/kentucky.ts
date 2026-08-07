import { measureIdentifiers } from "../../constants/constants";
import { Programs } from "../../types";

export const KY: Programs = {
  "Kentucky Managed Care Organization Program (KYMCO)": [
    {
      measure_name: "Breast Cancer Screening (HEDIS BCS)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "93",
    },
    {
      measure_name: "Controlling High Blood Pressure (HEDIS CBP)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "167",
    },
    {
      measure_name: "Prenatal And Postpartum Care (HEDIS PPC)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "581",
    },
    {
      measure_name:
        "Use Of First-Line Psychosocial Care For Children And Adolescents On Antipsychotics (HEDIS APP)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "743",
    },
    {
      measure_name:
        "Children Who Receive A Comprehensive Or Periodic Oral Evaluation (HEDIS OED)",
      measure_identifier: measureIdentifiers.yes,
      measure_identifierCmit: "897",
    },
  ],
};
