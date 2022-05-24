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
  sxOverrides,
  onChangeCallback,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, name } }) => {
        return (
          <Box sx={{ ...sx, ...sxOverrides }} className={mqClasses}>
            <CmsdsTextField
              name={name}
              id={name}
              label={label}
              placeholder={placeholder}
              onChange={(value: any) => {
                onChange(value);
                onChangeCallback?.(value);
              }}
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
  placeholder?: string;
  onChangeCallback?: Function;
  sxOverrides?: StyleObject;
  [key: string]: any;
}

const sx = {
  ".ds-c-field": {
    maxWidth: "40rem",
  },
};
