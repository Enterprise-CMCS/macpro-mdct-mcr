import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
// components
import { Dropdown as CmsdsDropdown } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses, parseCustomHtml } from "utils";
import { InputChangeEvent, AnyObject, DropdownOptions } from "types";

export const DropdownField = ({
  name,
  label = "",
  options,
  hint,
  nested,
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();
  const [fieldValue, setFieldValue] = useState<string>("");

  // get form context and register field
  const form = useFormContext();
  form.register(name);

  // hydrate and set initial field value
  const hydrationValue = props?.hydrate;
  useEffect(() => {
    if (hydrationValue) {
      setFieldValue(hydrationValue);
      form.setValue(name, hydrationValue, { shouldValidate: true });
    }
  }, [hydrationValue]);

  // update field value and form field data on change
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { name, value } = event.target;
    setFieldValue(value);
    form.setValue(name, value, { shouldValidate: true });
  };

  // prepare error message (if any), hint text, classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[name]?.message;
  const parsedHint = hint && parseCustomHtml(hint);
  const nestedChildClass = nested ? "nested ds-c-choice__checkedChild" : "";
  const labelClass = !label ? "no-label" : "";

  return (
    <Box
      sx={sxOverride}
      className={`${mqClasses} ${nestedChildClass} ${labelClass}`}
    >
      <CmsdsDropdown
        name={name}
        id={name}
        label={label}
        options={options}
        hint={parsedHint}
        onChange={(e) => onChangeHandler(e)}
        errorMessage={errorMessage}
        value={fieldValue}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  options: DropdownOptions[];
  hint?: any;
  nested?: boolean;
  sxOverride?: AnyObject;
  [key: string]: any;
}
