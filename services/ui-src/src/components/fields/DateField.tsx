import { useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { SingleInputDateField as CmsdsDateField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { AnyObject, CustomHtmlElement } from "types";
import {
  checkDateCompleteness,
  makeMediaQueryClasses,
  parseCustomHtml,
} from "utils";

export const DateField = ({
  name,
  label,
  hint,
  sxOverride,
  nested,
  nolabel,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

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
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const parsedHint = hint && parseCustomHtml(hint);

  return (
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={`${mqClasses} ${
        nolabel ? "no-label" : ""
      } ${nestedChildClasses}`}
    >
      <CmsdsDateField
        name={name}
        label={label}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        value={displayValue || props.hydrate || ""}
        hint={parsedHint}
        errorMessage={errorMessage}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label: string;
  hint?: CustomHtmlElement[];
  timetype?: string;
  nested?: boolean;
  nolabel?: boolean;
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  ".ds-c-field": {
    maxWidth: "7rem",
  },
  "&.no-label": {
    ".ds-c-label": {
      marginTop: "0.5rem",
    },
  },
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
