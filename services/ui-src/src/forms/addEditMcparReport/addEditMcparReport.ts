import { ProgramList } from "../../constants";
import { DropdownOptions } from "types";

// create dropdown options
const dropdownOptions: DropdownOptions[] = Object.keys(ProgramList).map(
  (value) => {
    return {
      label: ProgramList[value as keyof typeof ProgramList],
      value,
    };
  }
);

export default {
  id: "aep",
  options: {
    mode: "onChange",
  },
  heading: {
    add: "Add / Copy a MCPAR",
    subheading:
      "Complete the form below to generate a MCPAR for your managed care program. You may choose to copy an existing MCPAR report, which will retain many key responses (e.g., plan names, quality measures, etc.). Copied MCPARs will still have several blank fields and all responses can be edited. To create a blank MCPAR form, leave the “copy a report” field as “Select an option”.",
    edit: "Edit Program",
  },
  fields: [
    {
      id: "programName",
      type: "dropdown",
      validation: "dropdown",
      props: {
        label: "Program name (for new MCPAR)",
        hint: 'Select from an existing program name. If you need to add a new program or rename a program, select "Other, specify".',
        options: dropdownOptions,
      },
    },
    {
      id: "programName-otherText",
      type: "text",
      validation: "text",
      props: {
        label: "",
        hidden: true,
      },
    },
    {
      id: "copyFieldDataSourceId",
      type: "dropdown",
      props: {
        label: "If you want to copy an existing report, select one (optional)",
        options: "copyEligibleReports",
      },
    },
    {
      id: "reportingPeriodStartDate",
      type: "date",
      validation: "date",
      props: {
        label: "A.5a Reporting period (i.e. contract period) start date",
        hint: "Enter start date of the reporting period represented in the report.",
        timetype: "startDate",
      },
    },
    {
      id: "reportingPeriodEndDate",
      type: "date",
      validation: {
        type: "endDate",
        dependentFieldName: "reportingPeriodStartDate",
      },
      props: {
        label: "A.5b Reporting period  (i.e. contract period) end date",
        hint: "Enter end date of the reporting period represented in the report.",
        timetype: "endDate",
      },
    },
    {
      id: "combinedData",
      type: "checkboxSingle",
      validation: "checkboxSingle",
      props: {
        label: "Exclusion of CHIP from MCPAR",
        hint: "Enrollees in separate CHIP programs funded under Title XXI should not be reported in the MCPAR. Please check this box if the state is unable to remove information about Separate CHIP enrollees from its reporting on this program.",
      },
    },
    {
      id: "programIsPCCM",
      type: "radio",
      validation: "radio",
      props: {
        label: "Is your program a Primary Care Case Management (PCCM) entity?",
        hint: "If you designate the managed care program as a Primary Care Case Management Entity (PCCM-E), you are not required to complete the entire MCPAR Report. Please <a href='/help'>visit the “Get Help”</a> section for more information on how to complete the PCCM-E specific form.",
        choices: [
          {
            id: "yes_programIsPCCM",
            label: "Yes",
          },
          {
            id: "no_programIsNotPCCM",
            label: "No",
          },
        ],
      },
    },
  ],
};
