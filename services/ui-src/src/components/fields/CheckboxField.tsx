// components
import { Box } from "@chakra-ui/react";
import { ChoiceListField } from "components";
// utils
import { makeMediaQueryClasses } from "utils";
import { ChoiceFieldProps } from "types";

export const CheckboxField = ({
  name,
  label,
  choices,
  sxOverride,
  ...props
}: ChoiceFieldProps) => {
  const mqClasses = makeMediaQueryClasses();

  return (
    <Box sx={{ ...sxOverride }} className={`${mqClasses}`}>
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
