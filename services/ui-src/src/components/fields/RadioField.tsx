import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

// components
import { Box } from "@chakra-ui/react";
import { ChoiceListField } from "components";
// utils
import { makeMediaQueryClasses } from "utils";
import { InputChangeEvent, AnyObject, ChoiceValue, FieldChoice } from "types";

export const RadioField = ({
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
    const choiceSelected: ChoiceValue = {
      value: event.target.value,
    };
    setChoicesChosen([choiceSelected]);
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

interface Props {
  name: string;
  label: string;
  choices: FieldChoice[];
  sxOverride?: AnyObject;
  [key: string]: any;
}
