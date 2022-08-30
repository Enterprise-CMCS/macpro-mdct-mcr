import { States } from "../../../constants";
import { DropdownOptions } from "types";

// create dropdown options
const dropdownOptions: DropdownOptions[] = Object.keys(States).map((value) => {
  return {
    value,
    label: States[value as keyof typeof States],
  };
});

// insert the default option
dropdownOptions.splice(0, 0, { value: "", label: "- Select an option -" });

export default {
  id: "adminDashSelector",
  options: {
    mode: "onChange",
  },
  fields: [
    {
      id: "ads-state",
      type: "dropdown",
      props: {
        hint: "Select state to view reports:",
        options: dropdownOptions,
        ariaLabel:
          "List of states, including District of Columbia and Puerto Rico",
      },
    },
  ],
};
