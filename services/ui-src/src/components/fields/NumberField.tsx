import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { Box } from "@chakra-ui/react";
import { TextField } from "./TextField";
// utils
import {
  CustomMasks,
  isValidCustomMask,
  makeMediaQueryClasses,
  maskValue,
} from "utils";
import { InputChangeEvent, AnyObject } from "types";
import { TextFieldMask } from "@cmsgov/design-system/dist/types/TextField/TextField";

export const NumberField = ({
  name,
  label,
  placeholder,
  mask,
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  const hydrationValue = props?.hydrate;

  // check for value and valid custom mask; return masked value or original value
  const applyCustomMaskToValue = (value: any, mask: any) => {
    if (value && isValidCustomMask(mask)) {
      return maskValue(value, mask);
    } else return value;
  };

  // if mask specified, but not a custom mask, return mask as assumed CMSDS mask
  const validNonCustomMask =
    mask && !isValidCustomMask(mask) ? mask : undefined;

  const [displayValue, setDisplayValue] = useState(
    applyCustomMaskToValue(hydrationValue, mask) || ""
  );

  // get the form context
  const form = useFormContext();

  // update form data and masked display value on blur
  const onBlurHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const eventValue = applyCustomMaskToValue(value, mask);
    setDisplayValue(eventValue);
    form.setValue(name, eventValue, { shouldValidate: true });
  };

  // update form data on change
  const onChangeHandler = async (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setDisplayValue(value);
    form.setValue(name, value, { shouldValidate: true });
  };

  return (
    <Box sx={{ ...sx, ...sxOverride }} className={mqClasses}>
      <Box sx={sx.numberFieldContainer}>
        <TextField
          id={name}
          name={name}
          label={label}
          placeholder={placeholder}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          mask={validNonCustomMask}
          value={displayValue}
          controlled="true"
          {...props}
        />
        {mask === "percentage" && <Box sx={sx.percentage}> % </Box>}
      </Box>
    </Box>
  );
};

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  mask?: TextFieldMask | CustomMasks;
  nested?: boolean;
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  ".ds-c-field": {
    maxWidth: "15rem",
    paddingRight: "1.75rem",
  },
  numberFieldContainer: {
    position: "relative",
  },
  percentage: {
    fontSize: "lg",
    fontWeight: "700",
    paddingTop: "1px",
    bottom: "11px",
    left: "213px",
    position: "absolute",
  },
};
