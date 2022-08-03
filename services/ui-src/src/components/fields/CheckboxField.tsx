import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { Box } from "@chakra-ui/react";
import { ChoiceListField } from "components";
// utils
import { makeMediaQueryClasses } from "utils";
import { AnyObject, InputChangeEvent, FieldChoice } from "types";

export const CheckboxField = ({
  name,
  label,
  choices,
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();
  const [fieldValues, setFieldValues] = useState<string[] | null>(
    props.hydrate || null
  );

  // get the form context
  const form = useFormContext();

  // update local state
  const onChangeHandler = (event: InputChangeEvent) => {
    const checked = event.target.checked;
    const clickedChoice = event.target.value;
    const currentFieldValues = fieldValues || [];
    const newFieldValues = checked
      ? [...currentFieldValues, clickedChoice]
      : currentFieldValues.filter((value) => value !== clickedChoice);
    setFieldValues(newFieldValues);
  };

  useEffect(() => {
    // update form data
    if (fieldValues) {
      form.setValue(name, fieldValues, { shouldValidate: true });
      // update choice checked status
      choices.forEach((choice) => {
        if (fieldValues.includes(choice.value)) {
          choice.checked = true;
        } else {
          choice.checked = false;
        }
      });
    }
  }, [fieldValues]);

  const errorMessage = form?.formState?.errors?.[name]?.message;

  return (
    <Box sx={sxOverride} className={mqClasses}>
      <ChoiceListField
        name={name}
        type={"checkbox"}
        label={label}
        choices={choices}
        onChangeHandler={onChangeHandler}
        errorMessage={errorMessage}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label: string;
  choices: FieldChoice[];
  sxOverride?: AnyObject;
  [key: string]: any;
}
