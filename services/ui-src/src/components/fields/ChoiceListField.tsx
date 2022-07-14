import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "utils";
import { InputChangeEvent, AnyObject } from "types";

export const ChoiceListField = ({
  name,
  type,
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
    if (type == "checkbox") {
      setChoicesChosen((prevState) => {
        return prevState.map((choice) => {
          return choice.value === choiceSelected.value
            ? choiceSelected
            : choice;
        });
      });
    } else if (type == "radio") {
      setChoicesChosen((prevState) => {
        return prevState.map((choice) => {
          return choice.value === choiceSelected.value
            ? choiceSelected
            : { value: choice.value, checked: false };
        });
      });
    }
  };

  return (
    <Box sx={sxOverride} className={mqClasses}>
      <CmsdsChoiceList
        name={name}
        type={type}
        label={label}
        choices={choices}
        onChange={(e) => onChangeHandler(e)}
        {...props}
      />
    </Box>
  );
};

interface ChoiceListSelected {
  value: string;
  checked: boolean;
}

interface ChoiceListChoices {
  label: string;
  value: string;
}

interface Props {
  name: string;
  type: "checkbox" | "radio";
  label: string;
  choices: ChoiceListChoices[];
  sxOverride?: AnyObject;
  [key: string]: any;
}
