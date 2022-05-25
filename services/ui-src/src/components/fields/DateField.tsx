import { useState, useEffect } from "react";
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

export const DateField = ({
  name,
  label,
  customErrorMessage,
  sxOverrides,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  const [fieldData, setFieldData] = useState({
    day: 0,
    month: 0,
    year: 0,
  });

  const handleDateFieldChange = async (e: InputChangeEvent) => {
    console.log("changing date level"); // eslint-disable-line no-console
    const { name, value } = e.target;
    await setFieldData({
      ...fieldData,
      [name]: parseInt(value),
    });
  };

  const eventTimeMap: TimeMap = {
    startDate: midnight,
    endDate: oneSecondToMidnight,
  };

  useEffect(() => {
    const { year, month, day } = fieldData;
    const date = { year: year, month: month, day: day };
    const time = eventTimeMap[name as keyof TimeMap];
    const event = {
      target: { id: name, value: convertDateEtToUtc(date, time) },
    };
    form.onInputChange(event);
  }, [fieldData]);

  const { ...form }: any = useFormContext();
  const hasError = form.formState.errors?.[name]?.message;
  const errorMessage = hasError ? customErrorMessage || hasError : "";
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange } }) => {
        return (
          <Box sx={{ ...sx, ...sxOverrides }} className={mqClasses}>
            <CmsdsDateField
              label={label}
              onChange={(value: any) => {
                onChange(value);
                handleDateFieldChange?.(value);
              }}
              errorMessage={errorMessage}
              dayName="day"
              monthName="month"
              yearName="year"
              dayFieldRef={() => props.register("day")}
              monthFieldRef={() => props.register("month")}
              yearFieldRef={() => props.register("year")}
              {...props}
            />
          </Box>
        );
      }}
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
