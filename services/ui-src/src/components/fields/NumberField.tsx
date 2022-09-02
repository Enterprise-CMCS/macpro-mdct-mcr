import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { Box } from "@chakra-ui/react";
import { TextField } from "./TextField";
// utils
import {
  applyCustomMask,
  customMaskMap,
  makeMediaQueryClasses,
  validCmsdsMask,
} from "utils";
import { InputChangeEvent, AnyObject } from "types";
import { TextFieldMask as ValidCmsdsMask } from "@cmsgov/design-system/dist/types/TextField/TextField";

export const NumberField = ({
  name,
  label,
  placeholder,
  mask,
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();
  const [displayValue, setDisplayValue] = useState("");

  // get form context
  const form = useFormContext();

  // hydrate and set initial field value
  const hydrationValue = props?.hydrate;
  useEffect(() => {
    if (hydrationValue) {
      const maskedValue = applyCustomMask(hydrationValue, mask);
      setDisplayValue(maskedValue);
      form.setValue(name, maskedValue, { shouldValidate: true });
    }
  }, [hydrationValue]);

  // update form data on change, but do not mask
  const onChangeHandler = async (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setDisplayValue(value);
    form.setValue(name, value, { shouldValidate: true });
  };

  // update form data and display value on blur, using masked value
  const onBlurHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const maskedFieldValue = applyCustomMask(value, mask);
    setDisplayValue(maskedFieldValue);
    form.setValue(name, maskedFieldValue, { shouldValidate: true });
  };

  return (
    <Box sx={{ ...sx, ...sxOverride }} className={mqClasses}>
      <Box sx={sx.numberFieldContainer}>
        <TextField
          id={name}
          name={name}
          label={label || ""}
          placeholder={placeholder}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          mask={validCmsdsMask(mask)}
          value={displayValue}
          {...props}
        />
        {mask === "percentage" && <Box sx={sx.percentage}> % </Box>}
      </Box>
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  mask?: ValidCmsdsMask | keyof typeof customMaskMap;
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
    position: "absolute",
    bottom: "11px",
    left: "213px",
    paddingTop: "1px",
    fontSize: "lg",
    fontWeight: "700",
  },
};
