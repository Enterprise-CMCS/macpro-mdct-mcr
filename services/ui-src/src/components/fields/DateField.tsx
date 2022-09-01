import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { SingleInputDateField as CmsdsDateField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { AnyObject, CustomHtmlElement, InputChangeEvent } from "types";
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
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  const [displayValue, setDisplayValue] = useState<string>("");

  // hydrate and set initial field value
  useEffect(() => {
    if (props?.hydrate) {
      setDisplayValue(props?.hydrate);
      form.setValue(name, props?.hydrate, { shouldValidate: true });
    }
  }, [props?.hydrate]);

  // get form context and register field
  const form = useFormContext();
  form.register(name);

  // update field display value and form field data on change
  const onChangeHandler = (rawValue: string, formattedValue: string) => {
    setDisplayValue(rawValue);
    const completeDate = checkDateCompleteness(formattedValue);
    if (completeDate) {
      form.setValue(name, formattedValue, { shouldValidate: true });
    }
  };

  // update form field data on blur
  const onBlurHandler = (event: InputChangeEvent) => {
    const formattedValue = event.target.value;
    const completeDate = checkDateCompleteness(formattedValue);
    if (completeDate) {
      form.setValue(name, formattedValue, { shouldValidate: true });
    }
  };

  // prepare error message (if any), hint text, classes
  const errorMessage = form?.formState?.errors?.[name]?.message;
  const parsedHint = hint && parseCustomHtml(hint);
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const labelClass = !label ? "no-label" : "";

  return (
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={`${mqClasses} ${labelClass} ${nestedChildClasses}`}
    >
      <CmsdsDateField
        name={name}
        label={label || ""}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        value={displayValue}
        hint={parsedHint}
        errorMessage={errorMessage}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  hint?: CustomHtmlElement[];
  timetype?: string;
  nested?: boolean;
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
