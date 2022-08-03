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

  // update form data
  useEffect(() => {
    if (fieldValues) {
      form.setValue(name, fieldValues, { shouldValidate: true });

      // get all field choice dom elements
      const allFieldOptions = Array.from(document.getElementsByName(name));
      // for each field choice, get dom element and check against fieldValues (from state)
      choices.forEach((choice) => {
        // get the matching choice
        const optionElement = allFieldOptions.find(
          (option: any) => option.value === choice.value
        );

        // if the choice is in field values, check it; if not, uncheck it
        if (fieldValues.includes(choice.value)) {
          optionElement?.setAttribute("checked", "true");
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
