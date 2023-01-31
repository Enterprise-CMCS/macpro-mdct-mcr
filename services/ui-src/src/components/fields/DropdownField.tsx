import { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { Dropdown as CmsdsDropdown } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
import { ReportContext } from "components";
// utils
import { autosaveFieldData, parseCustomHtml, useUser } from "utils";
import {
  AnyObject,
  DropdownChoice,
  DropdownOptions,
  EntityShape,
  InputChangeEvent,
} from "types";
import { dropdownDefaultOptionText } from "../../constants";

export const DropdownField = ({
  name,
  label,
  options,
  hint,
  nested,
  autosave,
  sxOverride,
  ...props
}: Props) => {
  const { report, updateReport } = useContext(ReportContext);
  const { full_name, state } = useUser().user ?? {};

  // fetch the option values and format them if necessary
  const formatOptions = (options: DropdownOptions[] | string) => {
    let dropdownOptions = [];
    if (typeof options === "string") {
      const dynamicOptionValues = report?.fieldData[options];
      if (dynamicOptionValues) {
        const fieldOptions = dynamicOptionValues.map((option: EntityShape) => ({
          label: option.name,
          value: option.id,
        }));
        dropdownOptions = fieldOptions;
      }
    } else {
      dropdownOptions = options;
    }
    if (dropdownOptions[0]?.value !== "") {
      dropdownOptions.splice(0, 0, {
        label: dropdownDefaultOptionText,
        value: "",
      });
    }
    return dropdownOptions;
  };

  const defaultValue = formatOptions(options)[0];
  const [displayValue, setDisplayValue] =
    useState<DropdownChoice>(defaultValue);

  // get form context and register field
  const form = useFormContext();
  form.register(name);

  // set initial display value to form state field value or hydration value
  const hydrationValue = props?.hydrate || defaultValue;
  useEffect(() => {
    // if form state has value for field, set as display value
    const fieldValue = form.getValues(name);
    if (fieldValue) {
      setDisplayValue(fieldValue);
    }
    // else set hydrationValue or defaultValue as display value
    else if (hydrationValue) {
      setDisplayValue(hydrationValue);
      form.setValue(name, hydrationValue, { shouldValidate: true });
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

  // update form data
  const onChangeHandler = async (event: InputChangeEvent) => {
    const selectedOption = {
      label: event.target.id,
      value: event.target.value,
    };
    setDisplayValue(selectedOption);
    form.setValue(name, selectedOption, { shouldValidate: true });
  };

  // update form field data & database data on blur
  const onBlurHandler = async (event: InputChangeEvent) => {
    const selectedOption = {
      label: event.target.id,
      value: event.target.value,
    };
    // if blanking field, trigger client-side field validation error
    if (selectedOption === defaultValue) form.trigger(name);
    // submit field data to database
    if (autosave) {
      const fields = [
        { name, value: selectedOption, hydrationValue, defaultValue },
      ];
      const reportArgs = { id: report?.id, updateReport };
      const user = { userName: full_name, state };
      await autosaveFieldData({ form, fields, report: reportArgs, user });
    }
  };

  // prepare error message, hint, and classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[name]?.value?.message;
  const parsedHint = hint && parseCustomHtml(hint);
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const labelClass = !label ? "no-label" : "";

  return (
    <Box sx={sxOverride} className={`${nestedChildClasses} ${labelClass}`}>
      <CmsdsDropdown
        name={name}
        id={name}
        label={label || ""}
        options={formatOptions(options)}
        hint={parsedHint}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        errorMessage={errorMessage}
        value={displayValue?.value}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  hint?: any;
  options: DropdownOptions[] | string;
  nested?: boolean;
  autosave?: boolean;
  sxOverride?: AnyObject;
  [key: string]: any;
}
