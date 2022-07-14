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

export const CheckboxField = ({
  name,
  label,
  choices,
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  const [choicesChosen, setChoicesChosen] = useState<ChoiceListSelected[]>([]);

  useEffect(() => {
    form.setValue(name, choicesChosen, { shouldValidate: true });
  }, [choicesChosen]);

  // get the form context
  const form = useFormContext();

  // update form data
  const onChangeHandler = (event: InputChangeEvent) => {
    const checked = event.target.checked;
    const choiceSelected: ChoiceListSelected = {
      value: event.target.value,
      id: event.target.id,
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

  return (
    <Box sx={sxOverride} className={mqClasses}>
      <ChoiceListField
        name={name}
        type={"checkbox"}
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
