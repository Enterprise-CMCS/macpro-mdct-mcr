import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { Dropdown as CmsdsDropdown } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses, parseCustomHtml } from "utils";
import { InputChangeEvent, AnyObject, DropdownOptions } from "types";

export const DropdownField = ({
  name,
  label,
  options,
  hint,
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

  // update form data
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { name, value } = event.target;
    setFieldValue(value);
    form.setValue(name, value, { shouldValidate: true });
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
        options={options}
        hint={parsedHint}
        onChange={onChangeHandler}
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
  hint?: any;
  options: DropdownOptions[];
  sxOverride?: AnyObject;
  [key: string]: any;
}
