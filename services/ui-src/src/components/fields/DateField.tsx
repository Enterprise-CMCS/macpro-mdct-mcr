import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
// components
import { DateField as CmsdsDateField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "../../utils/useBreakpoint";
import { StyleObject, InputChangeEvent } from "utils/types/types";

export const DateField = ({
  name,
  label,
  customErrorMessage,
  sxOverrides,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  const [fieldData, setFieldData] = useState({
    "startDate-day": 0,
    "startDate-month": 0,
    "startDate-year": 0,
  });

  const handleDateFieldChange = async (e: InputChangeEvent) => {
    console.log("changing date level"); // eslint-disable-line no-console
    const { name, value } = e.target;
    await setFieldData({
      ...fieldData,
      [name]: parseInt(value),
    });
  };

  const combine = () => {
    console.log("FD", fieldData); // eslint-disable-line no-console
    const yep = fieldData["startDate-day"] + fieldData["startDate-month"];
    console.log("yep", yep); // eslint-disable-line no-console
    // form.onInputChange(yep);
  };

  const { ...form }: any = useFormContext();
  const hasError = form.formState.errors?.[name]?.message;
  const errorMessage = hasError ? customErrorMessage || hasError : "";
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, name } }) => {
        return (
          <Box sx={{ ...sx, ...sxOverrides }} className={mqClasses}>
            <CmsdsDateField
              label={label}
              onChange={(value: any) => {
                onChange(value);
                handleDateFieldChange?.(value).then(() => combine());
              }}
              errorMessage={errorMessage}
              dayName={`${name}-day`}
              monthName={`${name}-month`}
              yearName={`${name}-year`}
              dayFieldRef={() => props.register(`${name}-day`)}
              monthFieldRef={() => props.register(`${name}-month`)}
              yearFieldRef={() => props.register(`${name}-year`)}
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
