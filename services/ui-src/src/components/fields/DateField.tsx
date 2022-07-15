import { useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { SingleInputDateField as CmsdsDateField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { AnyObject } from "types";
import { makeMediaQueryClasses } from "utils";

/*
 * Note: This file uses the names 'parent'/'parentField' to refer to
 * the CMSDS Date Field (e.g. 'startDate'), and 'child'/'childField'
 * to refer to  and the contained day, month, year fields (e.g. 'day')
 */

export const DateField = ({
  name: parentFieldName,
  label: parentFieldLabel,
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  // get the form context
  const form = useFormContext();

  const [date, setDate] = useState("");

  const onChangeHandler = async (inputtedString: string) => {
    setDate(inputtedString);
    form.setValue(
      parentFieldName,
      inputtedString ? inputtedString : undefined,
      {
        shouldValidate: true,
      }
    );
  };

  const parentFieldErrorMessage =
    form?.formState?.errors?.[parentFieldName]?.message;

  return (
    <Box sx={{ ...sx, ...sxOverride }} className={mqClasses}>
      <CmsdsDateField
        name={parentFieldName}
        label={parentFieldLabel}
        onChange={onChangeHandler}
        value={date}
        errorMessage={parentFieldErrorMessage}
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

const sx = {};
