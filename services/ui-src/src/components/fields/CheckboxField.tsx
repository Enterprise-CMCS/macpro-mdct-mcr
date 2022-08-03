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
  const [fieldValues, setFieldValues] = useState<string[] | null>(null);

  // get the form context
  const form = useFormContext();

  // update local state
  const onChangeHandler = (event: InputChangeEvent) => {
    console.log("event", event);
    const checked = event.target.checked;
    const clickedChoice = event.target.value;
    const currentFieldValues = fieldValues || [];
    const newFieldValues = checked
      ? [...currentFieldValues, clickedChoice]
      : currentFieldValues.filter((value) => value !== clickedChoice);
    setFieldValues(newFieldValues);
    if (!checked) {
      const element: any = document.getElementById(event.target.id)!;
      element.checked = false;
      console.log("element", element);
    }
  };

  console.log("choices", choices);

  // update form data
  useEffect(() => {
    if (fieldValues) {
      form.setValue(name, fieldValues, { shouldValidate: true });
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
