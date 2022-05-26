import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
// components
import { DateField as CmsdsDateField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "../../utils/useBreakpoint";
import { StyleObject, InputChangeEvent, TimeMap } from "utils/types/types";
import {
  convertDateEtToUtc,
  midnight,
  oneSecondToMidnight,
} from "utils/time/time";

const eventTimeMap: TimeMap = {
  startDate: midnight,
  endDate: oneSecondToMidnight,
};

export const DateField = ({
  name: parentFieldName,
  label,
  customErrorMessage,
  sxOverrides,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  const [childFieldData, setChildFieldData] = useState({
    [`${parentFieldName}Day`]: 0,
    [`${parentFieldName}Month`]: 0,
    [`${parentFieldName}Year`]: 0,
  });

  const dayFieldName = `${parentFieldName}Day`;
  const monthFieldName = `${parentFieldName}Month`;
  const yearFieldName = `${parentFieldName}Year`;

  const updateChildDateFieldValue = async (e: InputChangeEvent) => {
    const { name: childFieldName, value } = e.target;
    // sets local field data state
    await setChildFieldData({
      ...childFieldData,
      [childFieldName]: parseInt(value),
    });
    // sets child date field value in parent form data
    const childFieldEvent = {
      target: { id: childFieldName, value: parseInt(value) },
    };
    form.onInputChange(childFieldEvent);
  };

  const updateParentFieldValue = () => {
    const date = {
      year: childFieldData[yearFieldName],
      month: childFieldData[monthFieldName],
      day: childFieldData[dayFieldName],
    };
    const time = eventTimeMap[parentFieldName as keyof TimeMap];
    const parentEvent = {
      target: { id: parentFieldName, value: convertDateEtToUtc(date, time) },
    };
    // updates parent field value in parent form data
    form.onInputChange(parentEvent);
  };

  const { ...form }: any = useFormContext();
  const parentHasError = form.formState.errors?.[parentFieldName]?.message;
  const parentErrorMessage = parentHasError
    ? customErrorMessage || parentHasError
    : "";
  const childErrorMessage = (childFieldName: string): string => {
    return form.formState.errors?.[childFieldName]?.message;
  };

  return (
    <Controller
      name={parentFieldName}
      control={form.control}
      render={() => (
        <Box sx={{ ...sx, ...sxOverrides }} className={mqClasses}>
          <CmsdsDateField
            label={label}
            onChange={(value: any) => {
              updateChildDateFieldValue?.(value);
            }}
            errorMessage={parentErrorMessage}
            onBlur={updateParentFieldValue}
            dayName={dayFieldName}
            monthName={monthFieldName}
            yearName={yearFieldName}
            dayFieldRef={() => props.register(dayFieldName)}
            monthFieldRef={() => props.register(monthFieldName)}
            yearFieldRef={() => props.register(yearFieldName)}
            dayInvalid={!!childErrorMessage(dayFieldName)}
            monthInvalid={!!childErrorMessage(monthFieldName)}
            yearInvalid={!!childErrorMessage(yearFieldName)}
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
  customErrorMessage?: string;
  sxOverrides?: StyleObject;
  [key: string]: any;
}

const sx = {};
