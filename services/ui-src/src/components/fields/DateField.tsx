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
import { useState } from "react";

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

  const onChangeHandler = async (event: string, formattedString: string) => {
    setDate(event);
    let year = parseInt(formattedString.split("/")?.[2]);
    let month = parseInt(formattedString.split("/")?.[0]);
    let day = parseInt(formattedString.split("/")?.[1]);
    if (year && month && day) {
      const time = calculateTimeByDateType(parentFieldName);
      const calculatedDatetime = convertDateEtToUtc({ year, month, day }, time);
      form.setValue(parentFieldName, calculatedDatetime, {
        shouldValidate: true,
      });
    }
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
