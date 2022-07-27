import { useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { SingleInputDateField as CmsdsDateField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { AnyObject } from "types";
import { checkDateCompleteness, makeMediaQueryClasses } from "utils";

export const DateField = ({
  name,
  label,
  hint,
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();
  const DOMPurify = require("dompurify")(window);

  // get the form context and register form field
  const form = useFormContext();
  form.register(name);

  const [displayValue, setDisplayValue] = useState<string>("");
  const [formattedValue, setFormattedValue] = useState<string>("");

  const onChangeHandler = (rawValue: string, formattedValue: string) => {
    setDisplayValue(rawValue);
    setFormattedValue(formattedValue);
    const completeDate = checkDateCompleteness(formattedValue);
    if (completeDate) {
      form.setValue(name, formattedValue, { shouldValidate: true });
    }
  };

  const onBlurHandler = () => {
    form.setValue(name, formattedValue, { shouldValidate: true });
  };

  const errorMessage = form?.formState?.errors?.[name]?.message;
  const hintText = hint ? (
    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(hint) }} />
  ) : undefined;

  return (
    <Box sx={{ ...sx, ...sxOverride }} className={mqClasses}>
      <CmsdsDateField
        name={name}
        label={label}
        hint={hintText}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        value={displayValue || props.hydrate || ""}
        errorMessage={errorMessage}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label: string;
  hint?: string;
  timetype?: string;
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  ".ds-c-field": {
    maxWidth: "7rem",
  },
};
