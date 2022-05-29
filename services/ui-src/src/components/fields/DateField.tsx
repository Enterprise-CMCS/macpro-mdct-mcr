import { Controller, useFormContext } from "react-hook-form";
// components
import { DateField as CmsdsDateField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { InputChangeEvent, StyleObject, TimeMap } from "utils/types/types";
import { makeMediaQueryClasses } from "../../utils/useBreakpoint";
import {
  convertDateEtToUtc,
  midnight,
  oneSecondToMidnight,
} from "utils/time/time";

/*
 * Note: This file uses the names 'parent'/'parentField' to refer to
 * the CMSDS Date Field (e.g. 'startDate'), and 'child'/'childField'
 * to refer to  and the contained day, month, year fields (e.g. 'day')
 */

const eventTimeMap: TimeMap = {
  startDate: midnight,
  endDate: oneSecondToMidnight,
};

export const DateField = ({
  name: parentFieldName,
  label: parentFieldLabel,
  sxOverrides,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  // get the form context
  const form = useFormContext();

  // make child field names
  const dayFieldName = `${parentFieldName}Day`;
  const monthFieldName = `${parentFieldName}Month`;
  const yearFieldName = `${parentFieldName}Year`;

  // set child field value in form data
  const setChildFieldValue = (
    childFieldName: string,
    childFieldValue: number
  ) => {
    form.setValue(childFieldName, childFieldValue, {
      shouldValidate: true,
    });
  };

  // set parent field value in form data
  const setParentFieldValue = () => {
    const {
      [dayFieldName]: day,
      [monthFieldName]: month,
      [yearFieldName]: year,
    } = form.getValues();
    // check that all values have been entered
    if (day && month && year) {
      const time = eventTimeMap[parentFieldName as keyof TimeMap];
      const calculatedDatetime = convertDateEtToUtc({ year, month, day }, time);
      form.setValue(parentFieldName, calculatedDatetime, {
        shouldValidate: true,
      });
    }
  };

  // call methods to update form data
  const onBlurHandler = async (event: InputChangeEvent) => {
    const { name: childFieldName, value: childFieldValue } = event.target;
    await setChildFieldValue(childFieldName, parseInt(childFieldValue));
    setParentFieldValue();
  };

  const parentFieldErrorMessage =
    form.formState.errors?.[parentFieldName]?.message;
  const checkChildFieldError = (childFieldName: string): string => {
    return form.formState.errors?.[childFieldName]?.message;
  };

  return (
    <Controller
      name={parentFieldName}
      control={form.control}
      render={() => (
        <Box sx={{ ...sx, ...sxOverrides }} className={mqClasses}>
          <CmsdsDateField
            label={parentFieldLabel}
            onBlur={(e) => onBlurHandler(e)}
            errorMessage={parentFieldErrorMessage}
            dayName={dayFieldName}
            monthName={monthFieldName}
            yearName={yearFieldName}
            dayFieldRef={() => form.register(dayFieldName)}
            monthFieldRef={() => form.register(monthFieldName)}
            yearFieldRef={() => form.register(yearFieldName)}
            dayInvalid={!!checkChildFieldError(dayFieldName)}
            monthInvalid={!!checkChildFieldError(monthFieldName)}
            yearInvalid={!!checkChildFieldError(yearFieldName)}
            {...props}
          />
        </Box>
      )}
    />
  );
};

interface Props {
  name: string;
  label: string;
  sxOverrides?: StyleObject;
  [key: string]: any;
}

const sx = {};
