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
    <Box sx={{ ...sx, ...sxOverride }}>
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

const sx = {
  ".ds-c-choice:disabled::before": {
    boxShadow: "inset 0 0 4em 1em #A6A6A6",
  },
  ".ds-c-choice:disabled": {
    borderColor: "palette.gray_light",
  },
};
