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

  const parentName = name;
  const dayFieldName = `${parentName}Day`;
  const monthFieldName = `${parentName}Month`;
  const yearFieldName = `${parentName}Year`;

  const [fieldData, setFieldData] = useState({
    [`${parentName}Day`]: 0,
    [`${parentName}Month`]: 0,
    [`${parentName}Year`]: 0,
  });

  const handleDateFieldChange = async (e: InputChangeEvent) => {
    const { name, value } = e.target;

    const childEvent = {
      target: { id: name, value: parseInt(value) },
    };
    console.log("on update child event", childEvent); // eslint-disable-line no-console
    form.onInputChange(childEvent);

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
    const date = {
      year: fieldData[yearFieldName],
      month: fieldData[monthFieldName],
      day: fieldData[dayFieldName],
    };
    console.log("use effect date", date); // eslint-disable-line no-console

    const time = eventTimeMap[name as keyof TimeMap];
    const parentEvent = {
      target: { id: name, value: convertDateEtToUtc(date, time) },
    };
    console.log("use effect parentEvent", parentEvent); // eslint-disable-line no-console
    form.onInputChange(parentEvent);
  }, [fieldData]);

  const { ...form }: any = useFormContext();
  const parentHasError = form.formState.errors?.[name]?.message;
  const parentErrorMessage = parentHasError
    ? customErrorMessage || parentHasError
    : "";
  const childErrorMessage = (childFieldName: string): string => {
    return form.formState.errors?.[childFieldName]?.message;
  };

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
              errorMessage={parentErrorMessage}
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
