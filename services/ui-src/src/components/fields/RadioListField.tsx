import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

// components
import {
  ChoiceListChoices,
  ChoiceListField,
  ChoiceListSelected,
} from "./ChoiceListField";
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "utils";
import { InputChangeEvent, AnyObject } from "types";

export const RadioListField = ({
  name,
  label,
  choices,
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();
  const defaultChoices = choices.map((choice) => {
    return { value: choice.value, checked: false };
  });

  const [choicesChosen, setChoicesChosen] =
    useState<ChoiceListSelected[]>(defaultChoices);

  useEffect(() => {
    form.setValue(name, choicesChosen, { shouldValidate: true });
  }, [choicesChosen]);

  // get the form context
  const form = useFormContext();

  // update form data
  const onChangeHandler = (event: InputChangeEvent) => {
    const choiceSelected: ChoiceListSelected = {
      value: event.target.value,
      checked: event.target.checked,
    };
    setChoicesChosen((prevState) => {
      return prevState.map((choice) => {
        return choice.value === choiceSelected.value
          ? choiceSelected
          : { value: choice.value, checked: false };
      });
    });
  };

  return (
    <Box sx={sxOverride} className={mqClasses}>
      <ChoiceListField
        name={name}
        type={"radio"}
        label={label}
        choices={choices}
        onChangeHandler={onChangeHandler}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label: string;
  choices: ChoiceListChoices[];
  sxOverride?: AnyObject;
  [key: string]: any;
}
