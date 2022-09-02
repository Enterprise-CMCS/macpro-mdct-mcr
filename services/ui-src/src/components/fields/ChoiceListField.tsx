import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import {
  formFieldFactory,
  makeMediaQueryClasses,
  parseCustomHtml,
} from "utils";
import {
  AnyObject,
  CustomHtmlElement,
  FieldChoice,
  InputChangeEvent,
} from "types";

export const ChoiceListField = ({
  name,
  type,
  label,
  choices,
  hint,
  nested,
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  // get form context and register field
  const form = useFormContext();
  form.register(name);

  const [fieldValues, setFieldValues] = useState<string[] | null>(null);

  // hydrate and set initial field value
  const hydrationValue = props?.hydrate;
  useEffect(() => {
    if (hydrationValue) {
      console.log("hydrationValue: ", name, ":", hydrationValue);
      setFieldValues(hydrationValue);
      form.setValue(name, hydrationValue, { shouldValidate: true });
    }
  }, [hydrationValue]);

  // update form field data and DOM display checked attribute
  useEffect(() => {
    if (fieldValues) {
      form.setValue(name, fieldValues, { shouldValidate: true });
    }
    // update DOM choices checked status
    choices.forEach((choice: FieldChoice) => {
      choice.checked = fieldValues?.includes(choice.value) || false;
    });
  }, [fieldValues]);

  const formFieldValues = form.getValues(name);
  useEffect(() => {
    console.log("formFieldValues: ", name, ":", formFieldValues);
  }, [formFieldValues]);

  // format choices with nested child fields to render (if any)
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

  // update field values
  const onChangeHandler = (event: InputChangeEvent) => {
    const clickedOption = event.target.value;
    const isOptionChecked = event.target.checked;
    const preChangeFieldValues = fieldValues || [];
    // handle radio
    if (type === "radio") {
      setFieldValues([clickedOption]);
    }
    // handle checkbox
    if (type === "checkbox") {
      const checkedOptionValues = [...preChangeFieldValues, clickedOption];
      const uncheckedOptionValues = preChangeFieldValues.filter(
        (value) => value !== clickedOption
      );
      setFieldValues(
        isOptionChecked ? checkedOptionValues : uncheckedOptionValues
      );
    }
  };

  // prepare error message, hint, and classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[name]?.message;
  const parsedHint = hint && parseCustomHtml(hint);
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const labelClass = !label ? "no-label" : "";

  return (
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={`${nestedChildClasses} ${labelClass} ${mqClasses}`}
    >
      <CmsdsChoiceList
        name={name}
        type={type}
        label={label || ""}
        choices={formatChoices(choices)}
        hint={parsedHint}
        errorMessage={errorMessage}
        onChange={onChangeHandler}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  type: "checkbox" | "radio";
  label?: string;
  choices: FieldChoice[];
  hint?: CustomHtmlElement[];
  nested?: boolean;
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  // checkboxes
  ".ds-c-choice[type='checkbox']:checked::after": {
    boxSizing: "content-box",
  },
};
