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

  const onChangeHandler = async (event: string, formattedString: string) => {
    setDisplayValue(event);
    // parse formatted string
    let month = parseInt(formattedString.split("/")?.[0]);
    let day = parseInt(formattedString.split("/")?.[1]);
    let year = parseInt(formattedString.split("/")?.[2]);
    // if full date entered, convert, set, and validate
    if (month && day && year.toString().length === 4) {
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
        value={displayValue || props.hydrate}
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
