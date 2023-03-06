import { States } from "../../constants";
import { DropdownOptions } from "types";

// create dropdown options
const dropdownOptions: DropdownOptions[] = Object.keys(States).map((value) => {
  return {
    label: States[value as keyof typeof States],
    value,
  };
});

const reportChoices = [
  {
    id: "MCPAR",
    label: "Managed Care Program Annual Report (MCPAR)",
  },
];

export default {
  id: "adminDashSelector",
  options: {
    mode: "onChange",
  },
  fields: [
    {
      id: "state",
      type: "dropdown",
      validation: "dropdown",
      props: {
        hint: "Select state to view reports:",
        options: dropdownOptions,
        ariaLabel:
          "List of states, including District of Columbia and Puerto Rico",
      },
    },
    {
      id: "report",
      type: "radio",
      validation: "radio",
      props: {
        hint: "Select a report:",
        choices: reportChoices,
        ariaLabel: "Choices of report type",
      },
    },
  ],
};
