import { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
import { ReportContext } from "components";
// utils
import {
  formFieldFactory,
  hydrateFormFields,
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
  const { reportData } = useContext(ReportContext);
  const [fieldValues, setFieldValues] = useState<string[] | null>(null);

  // get form context and register field
  const form = useFormContext();
  form.register(name);

  // hydrate and set initial field value
  const hydrationValue = props?.hydrate;
  useEffect(() => {
    if (hydrationValue) {
      setFieldValues(hydrationValue);
      form.setValue(name, hydrationValue, { shouldValidate: true });
    }
  }, [hydrationValue]);

  // format choices with nested child fields to render (if any)
  const formattedChoices = choices.map((choice: FieldChoice) => {
    const choiceObject = choice;
    const choiceChildren = choice?.children;
    if (choiceChildren) {
      // // if children exist, render
      const hydratedChildren = hydrateFormFields(choiceChildren, reportData);
      const formattedChildren = formFieldFactory(hydratedChildren, true);
      // set rendered children to checkedChildren prop
      choiceObject.checkedChildren = formattedChildren;
      // delete disallowed children prop
      delete choiceObject.children;
    }
    return choiceObject;
  });

  // update field values and form field data on change
  const onChangeHandler = (event: InputChangeEvent) => {
    const clickedOption = event.target.value;
    const isOptionChecked = event.target.checked;
    const currentFieldValues = fieldValues || [];
    // handle radio
    if (type === "radio") {
      setFieldValues([clickedOption]);
    }
    // handle checkbox
    if (type === "checkbox") {
      const checkedOptionValues = [...currentFieldValues, clickedOption];
      const uncheckedOptionValues = currentFieldValues.filter(
        (value) => value !== clickedOption
      );
      setFieldValues(
        isOptionChecked ? checkedOptionValues : uncheckedOptionValues
      );
    }
  };

  // updated DOM display 'checked' values on any fieldValue change
  useEffect(() => {
    // update form data
    if (fieldValues) {
      form.setValue(name, fieldValues, { shouldValidate: true });
      // update DOM choices checked status
      choices.forEach((choice: FieldChoice) => {
        choice.checked = fieldValues.includes(choice.value);
      });
    }
  }, [fieldValues]);

  // prepare error message (if any), hint text, classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[name]?.message;
  const parsedHint = hint && parseCustomHtml(hint);
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const labelClass = !label ? "no-label" : "";

  return (
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={`${nestedChildClasses} ${mqClasses} ${labelClass}`}
    >
      <CmsdsChoiceList
        name={name}
        type={type}
        label={label}
        choices={formattedChoices}
        hint={parsedHint}
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
  label?: string;
  choices: FieldChoice[];
  hint?: CustomHtmlElement[];
  nested?: boolean;
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  "&.ds-c-choice__checkedChild": {
    "&.no-label": {
      paddingY: 0,
    },
  },
  ".ds-c-choice[type='checkbox']:checked::after": {
    boxSizing: "content-box",
  },
  "&.nested": {
    fieldset: {
      marginTop: 0,
    },
  },
};
