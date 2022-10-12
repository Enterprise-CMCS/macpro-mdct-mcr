import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { Box } from "@chakra-ui/react";
import { TextField } from "./TextField";
// utils
import { applyCustomMask, customMaskMap, validCmsdsMask } from "utils";
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
  const [displayValue, setDisplayValue] = useState("");

  // get form context
  const form = useFormContext();

  // set initial display value to form state field value or hydration value
  const hydrationValue = props?.hydrate;
  useEffect(() => {
    // if form state has value for field, set as display value
    const fieldValue = form.getValues(name);
    if (fieldValue) {
      const maskedFieldValue = applyCustomMask(fieldValue, mask);
      setDisplayValue(maskedFieldValue);
    }
    // else if hydration value exists, set as display value
    else if (hydrationValue) {
      const maskedHydrationValue = applyCustomMask(hydrationValue, mask);
      setDisplayValue(maskedHydrationValue);
      form.setValue(name, maskedHydrationValue, { shouldValidate: true });
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

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
    <Box sx={{ ...sx, ...sxOverride }}>
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
