import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { Box } from "@chakra-ui/react";
import { ChoiceListField } from "components";
// utils
import { makeMediaQueryClasses } from "utils";
import { AnyObject, InputChangeEvent, ChoiceValue, FieldChoice } from "types";

export const CheckboxField = ({
  name,
  label,
  choices,
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  const [choicesChosen, setChoicesChosen] = useState<ChoiceValue[]>([]);

  useEffect(() => {
    form.setValue(name, choicesChosen, { shouldValidate: true });
  }, [choicesChosen]);

  // get the form context
  const form = useFormContext();

  // update form data
  const onChangeHandler = (event: InputChangeEvent) => {
    const checked = event.target.checked;
    const choiceSelected: ChoiceValue = {
      value: event.target.value,
    };
    setChoicesChosen((prevState) => {
      if (!checked) {
        return prevState.filter(
          (choice) => choice.value !== choiceSelected.value
        );
      } else {
        return [...prevState, choiceSelected];
      }
    });
  };

  const errorMessage = form?.formState?.errors?.[name]?.message;

  return (
    <Box sx={sxOverride} className={mqClasses}>
      {errorMessage}
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
