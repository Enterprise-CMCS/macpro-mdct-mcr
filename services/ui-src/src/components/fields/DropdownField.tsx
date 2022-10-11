import { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { Dropdown as CmsdsDropdown } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
import { ReportContext } from "components";
// utils
import { makeMediaQueryClasses, parseCustomHtml } from "utils";
import {
  InputChangeEvent,
  AnyObject,
  DropdownOptions,
  EntityShape,
} from "types";
import { dropdownDefaultOptionText } from "../../constants";

export const DropdownField = ({
  name,
  label,
  options,
  hint,
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();
  const [displayValue, setDisplayValue] = useState<string>(
    dropdownDefaultOptionText
  );

  // get form context and register field
  const form = useFormContext();
  form.register(name);
  const { report } = useContext(ReportContext);

  // set initial display value to form state field value or hydration value
  const hydrationValue = props?.hydrate;
  useEffect(() => {
    // if form state has value for field, set as display value
    const fieldValue = form.getValues(name);
    if (fieldValue) {
      setDisplayValue(fieldValue);
    }
    // else if hydration value exists, set as display value
    else if (hydrationValue) {
      setDisplayValue(hydrationValue);
      form.setValue(name, hydrationValue, { shouldValidate: true });
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

  // update form data
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { name, value } = event.target;
    setDisplayValue(value);
    form.setValue(name, value, { shouldValidate: true });
  };

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

  // prepare error message, hint, and classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[name]?.message;
  const parsedHint = hint && parseCustomHtml(hint);
  const labelClass = !label ? "no-label" : "";

  return (
    <Box sx={sxOverride} className={`${mqClasses} ${labelClass}`}>
      <CmsdsDropdown
        name={name}
        id={name}
        label={label || ""}
        options={formatOptions(options)}
        hint={parsedHint}
        onChange={onChangeHandler}
        errorMessage={errorMessage}
        value={displayValue}
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
  sxOverride?: AnyObject;
  [key: string]: any;
}
