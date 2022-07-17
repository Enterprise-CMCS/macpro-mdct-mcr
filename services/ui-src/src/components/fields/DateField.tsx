import { useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { SingleInputDateField as CmsdsDateField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { AnyObject } from "types";
import {
  convertDateEtToUtc,
  calculateTimeByDateType,
  makeMediaQueryClasses,
} from "utils";

export const DateField = ({ name, label, sxOverride, ...props }: Props) => {
  const mqClasses = makeMediaQueryClasses();

  // get the form context and register form field
  const form = useFormContext();
  form.register(name);

  const [displayValue, setDisplayValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");

  const onChangeHandler = async (event: string, formattedString: string) => {
    form.setValue(name, parseInt(event), {
      shouldValidate: true,
    });
    setDisplayValue(event);
    setFormattedValue(formattedString);
  };

  const onBlurHandler = () => {
    let year = parseInt(formattedValue.split("/")?.[2]);
    let month = parseInt(formattedValue.split("/")?.[0]);
    let day = parseInt(formattedValue.split("/")?.[1]);
    if (!!year && !!month && !!day) {
      const time = calculateTimeByDateType(name);
      const calculatedDatetime = convertDateEtToUtc({ year, month, day }, time);
      form.setValue(name, calculatedDatetime, {
        shouldValidate: true,
      });
    }
  };

  const errorMessage = form?.formState?.errors?.[name]?.message;

  return (
    <Box sx={{ ...sx, ...sxOverride }} className={mqClasses}>
      <CmsdsDateField
        name={name}
        label={label}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        value={displayValue}
        errorMessage={errorMessage}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label: string;
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  ".ds-c-field": {
    maxWidth: "7rem",
  },
};
