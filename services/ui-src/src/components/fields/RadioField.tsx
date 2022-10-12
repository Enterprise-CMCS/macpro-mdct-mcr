// components
import { Box } from "@chakra-ui/react";
import { ChoiceListField } from "components";
// utils
import { ChoiceFieldProps } from "types";

export const RadioField = ({
  name,
  label,
  choices,
  sxOverride,
  ...props
}: ChoiceFieldProps) => {
  return (
    <Box sx={sxOverride}>
      <ChoiceListField
        name={name}
        type="radio"
        label={label}
        choices={choices}
        {...props}
      />
    </Box>
  );
};
