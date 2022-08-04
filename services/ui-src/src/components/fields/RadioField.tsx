import { useFormContext } from "react-hook-form";

// components
import { Box } from "@chakra-ui/react";
import { ChoiceListField } from "components";
// utils
import { makeMediaQueryClasses } from "utils";
import { ChoiceFieldProps } from "types";

export const RadioField = ({
  name,
  label,
  choices,
  sxOverride,
  ...props
}: ChoiceFieldProps) => {
  const mqClasses = makeMediaQueryClasses();

  // get the form context
  const form = useFormContext();

  const errorMessage = form?.formState?.errors?.[name]?.message;

  return (
    <Box sx={sxOverride} className={mqClasses}>
      <ChoiceListField
        name={name}
        type={"radio"}
        label={label}
        choices={choices}
        errorMessage={errorMessage}
        {...props}
      />
    </Box>
  );
};
