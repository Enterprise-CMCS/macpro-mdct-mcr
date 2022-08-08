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

  const form = useFormContext();
  form.register(name);

  const [fieldValues, setFieldValues] = useState<string[] | null>(
    form.getValues(name) || props.hydrate || null
  );

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
    const clickedOption = event.target.value;
    const isOptionChecked = event.target.checked;
    const currentFieldValues = fieldValues || [];
    // handle radio
    if (type === "radio") {
      setFieldValues([clickedOption]);
    } else {
      // handle checkbox
      setFieldValues(
        isOptionChecked
          ? [...currentFieldValues, clickedOption]
          : currentFieldValues.filter((value) => value !== clickedOption)
      );
    }
  };

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

  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const parsedHint = hint && parseCustomHtml(hint);
  const errorMessage = form?.formState?.errors?.[name]?.message;

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
  label: string;
  choices: FieldChoice[];
  hint?: CustomHtmlElement[];
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
