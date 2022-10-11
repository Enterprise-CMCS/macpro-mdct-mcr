// components
import { Box } from "@chakra-ui/react";
import { ChoiceListField } from "components";
// utils
import { ChoiceFieldProps } from "types";

export const CheckboxField = ({
  name,
  label,
  choices,
  sxOverride,
  ...props
}: ChoiceFieldProps) => {
  return (
    <Box sx={{ ...sxOverride }}>
      <ChoiceListField
        type="checkbox"
        name={name}
        label={label}
        choices={choices}
        {...props}
      />
    </Box>
  );
};
