import { Controller, useFormContext } from "react-hook-form";
// components
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "../../utils/useBreakpoint";
import { StyleObject } from "utils/types/types";

export const TextField = ({
  name,
  label,
  placeholder,
  customErrorMessage,
  sxOverrides,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  const { ...form }: any = useFormContext();
  const hasError = form.formState.errors?.[name]?.message;
  const errorMessage = hasError ? customErrorMessage || hasError : "";

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, name } }) => (
        <Box sx={{ ...sx, ...sxOverrides }} className={mqClasses}>
          <CmsdsTextField
            name={name}
            id={name}
            label={label}
            placeholder={placeholder}
            onChange={(value: any) => {
              onChange(value);
              form.onInputChange?.(value);
            }}
            errorMessage={errorMessage}
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
  placeholder?: string;
  customErrorMessage?: string;
  sxOverrides?: StyleObject;
  [key: string]: any;
}

const sx = {
  ".ds-c-field": {
    maxWidth: "40rem",
  },
};
