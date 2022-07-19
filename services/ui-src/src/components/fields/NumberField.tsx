import { useFormContext } from "react-hook-form";
// components
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "utils";
import { InputChangeEvent, AnyObject } from "types";
import React, { useState } from "react";
import { customMask, CustomMasks, isCustomMask } from "utils/other/mask";

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

  const [value, setValue] = useState(
    isCustomMask(mask)
      ? customMask(props?.hydrate || "", mask)
      : props?.hydrate || ""
  );

  // get the form context
  const form = useFormContext();

  const onBlurHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (isCustomMask(mask)) {
      const eventValue = customMask(evt.target.value, mask);
      setValue(eventValue);
      form.setValue(name, eventValue, { shouldValidate: true });
    } else {
      setValue(evt.target.value);
      form.setValue(name, evt.target.value, { shouldValidate: true });
    }
  };

  // update form data
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { name, value } = event.target;
    setValue(value);
    form.setValue(name, value, { shouldValidate: true });
  };

  const errorMessage = form?.formState?.errors?.[name]?.message;
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";

  /*
   * Check if its not a custom mask and if the mask is defined as "currency" | "phone" | "ssn" | "zip".
   * If its not, we dont want to use the mask prop so return undefined.
   */
  const useMask = mask && !isCustomMask(mask) ? mask : undefined;

  return (
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={`${mqClasses} ${nestedChildClasses}`}
    >
      <CmsdsTextField
        id={name}
        name={name}
        label={label}
        placeholder={placeholder}
        onChange={(e) => onChangeHandler(e)}
        onBlur={onBlurHandler}
        errorMessage={errorMessage}
        inputRef={() => form.register(name)}
        mask={useMask}
        value={value}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label: string;
  mask?: "currency" | "phone" | "ssn" | "zip" | CustomMasks;
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
