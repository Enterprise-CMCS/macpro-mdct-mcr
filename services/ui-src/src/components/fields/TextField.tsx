import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
// components
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses, parseCustomHtml } from "utils";
import { InputChangeEvent, AnyObject, CustomHtmlElement } from "types";

export const TextField = ({
  name,
  label,
  hint,
  placeholder,
  sxOverride,
  nested,
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

  // update field display value and form field data on change
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
      sx={{ ...sx, ...sxOverride }}
      className={`${mqClasses} ${nestedChildClass} ${labelClass}`}
    >
      <CmsdsTextField
        id={name}
        name={name}
        label={label || ""}
        hint={parsedHint}
        placeholder={placeholder}
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
  hint?: CustomHtmlElement[];
  placeholder?: string;
  sxOverride?: AnyObject;
  nested?: boolean;
  controlled?: string;
  [key: string]: any;
}

const sx = {
  "&.ds-c-choice__checkedChild": {
    "&.no-label": {
      paddingY: 0,
    },
  },
  "&.nested": {
    label: {
      marginTop: 0,
    },
  },
};
