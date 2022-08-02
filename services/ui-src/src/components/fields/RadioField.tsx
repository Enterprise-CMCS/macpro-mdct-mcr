import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

// components
import { Box } from "@chakra-ui/react";
import { ChoiceListField } from "components";
// utils
import { makeMediaQueryClasses } from "utils";
import { ChoiceFieldProps, InputChangeEvent } from "types";

export const RadioField = ({
  name,
  label,
  choices,
  sxOverride,
  ...props
}: ChoiceFieldProps) => {
  const mqClasses = makeMediaQueryClasses();

  const [fieldValue, setFieldValue] = useState<string[] | null>(null);

  useEffect(() => {
    if (fieldValue) {
      form.setValue(name, fieldValue, { shouldValidate: true });
    }
  }, [fieldValue]);

  // get the form context
  const form = useFormContext();

  // update form data
  const onChangeHandler = (event: InputChangeEvent) => {
    const optionValue = event.target.value;
    setFieldValue([optionValue]);
  };

  const errorMessage = form?.formState?.errors?.[name]?.message;

  return (
    <Box sx={sxOverride} className={mqClasses}>
      <ChoiceListField
        name={name}
        type={"radio"}
        label={label}
        choices={choices}
        onChangeHandler={onChangeHandler}
        errorMessage={errorMessage}
        {...props}
      />
    </Box>
  );
};
