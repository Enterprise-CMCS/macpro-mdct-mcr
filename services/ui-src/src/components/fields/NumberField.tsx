import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { Box } from "@chakra-ui/react";
import { TextField } from "./TextField";
// utils
import {
  CustomMasks,
  isCustomMask,
  makeMediaQueryClasses,
  maskValue,
} from "utils";
import { InputChangeEvent, AnyObject } from "types";

export const NumberField = ({
  name,
  label,
  placeholder,
  mask,
  sxOverride,
  nested,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  const [value, setValue] = useState(props?.hydrate || "");

  // get the form context
  const form = useFormContext();

  const onBlurHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const eventValue = isCustomMask(mask)
      ? maskValue(e.target.value, mask)
      : e.target.value;
    setValue(eventValue);
    form.setValue(name, eventValue, { shouldValidate: true });
  };

  // update form data
  const onChangeHandler = async (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setValue(value);
    form.setValue(name, value, { shouldValidate: true });
  };

  const errorMessage = form?.formState?.errors?.[name]?.message;
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";

  /*
   * Check if its not a custom mask and if the mask is defined as "currency"
   * If its not, we dont want to use the mask prop so return undefined.
   */
  const useMask = mask && !isCustomMask(mask) ? mask : undefined;

  return (
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={`${mqClasses} ${nestedChildClasses}`}
    >
      <TextField
        id={name}
        name={name}
        label={label}
        placeholder={placeholder}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        errorMessage={errorMessage}
        inputRef={() => form.register(name)}
        mask={useMask}
        value={value}
        sx={{ ...sx, ...sxOverride }}
        className={`${mqClasses} ${nestedChildClasses}`}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label: string;
  mask?: "currency" | CustomMasks;
  placeholder?: string;
  nested?: boolean;
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  "&.nested": {
    label: {
      marginTop: 0,
    },
  },
};
