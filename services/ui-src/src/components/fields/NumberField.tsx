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

  const [displayValue, setDisplayValue] = useState(props?.hydrate || "");

  // get the form context
  const form = useFormContext();

  const onBlurHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const eventValue = isValidCustomMask(mask) ? maskValue(value, mask) : value;
    setDisplayValue(eventValue);
    form.setValue(name, eventValue, { shouldValidate: true });
  };

  // update form data
  const onChangeHandler = async (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setDisplayValue(value);
    form.setValue(name, value, { shouldValidate: true });
  };

  /*
   * Check if its not a custom mask and if the mask is defined as "currency"
   * or another CMSDS provided mask
   * If its not, we dont want to use the mask prop so return undefined.
   */
  const cmsdsProvidedMask = mask && !isValidCustomMask(mask) ? mask : undefined;

  // const maskToUse = customMaskMap[mask] || mask;

  return (
    <Box sx={{ ...sx, ...sxOverride }} className={mqClasses}>
      <TextField
        id={name}
        name={name}
        label={label}
        placeholder={placeholder}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        mask={cmsdsProvidedMask}
        value={displayValue}
        {...props}
      />
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
  },
};
