import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { formFieldFactory, makeMediaQueryClasses } from "utils";
import { AnyObject, FieldChoice, InputChangeEvent } from "types";

export const ChoiceListField = ({
  name,
  type,
  label,
  choices,
  nested,
  errorMessage,
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  const [fieldValues, setFieldValues] = useState<string[] | null>(
    props.hydrate || null
  );

  const form = useFormContext();
  form.register(name);

  const formatChoices = (choices: FieldChoice[]) =>
    choices.map((choice: FieldChoice) => {
      const choiceObject: FieldChoice = { ...choice };
      const choiceChildren = choice?.children;
      if (choiceChildren) {
        const formattedChildren = formFieldFactory(choiceChildren, true);
        choiceObject.checkedChildren = formattedChildren;
      }
      delete choiceObject.children;
      return choiceObject;
    });

  // update local state
  const onChangeHandler = (event: InputChangeEvent) => {
    const checked = event.target.checked;
    const clickedChoice = event.target.value;
    if (type === "radio") {
      setFieldValues([clickedChoice]);
    } else {
      const currentFieldValues = fieldValues || [];
      const newFieldValues = checked
        ? [...currentFieldValues, clickedChoice]
        : currentFieldValues.filter((value) => value !== clickedChoice);
      setFieldValues(newFieldValues);
    }
  };

  useEffect(() => {
    // update form data
    if (fieldValues) {
      form.setValue(name, fieldValues, { shouldValidate: true });
      // update choice checked status
      choices.forEach((choice: FieldChoice) => {
        choice.checked = fieldValues.includes(choice.value);
      });
    }
  }, [fieldValues]);

  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";

  return (
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={`${nestedChildClasses} ${mqClasses}`}
    >
      <CmsdsChoiceList
        name={name}
        type={type}
        label={label}
        choices={formatChoices(choices)}
        errorMessage={errorMessage}
        onChange={(e) => onChangeHandler(e)}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  type: "checkbox" | "radio";
  label: string;
  choices: FieldChoice[];
  nested?: boolean;
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  ".ds-c-choice[type='checkbox']:checked::after": {
    boxSizing: "content-box",
  },
  "&.nested": {
    fieldset: {
      marginTop: 0,
    },
  },
};
