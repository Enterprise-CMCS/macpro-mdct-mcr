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
import { AnyObject, CustomHtmlElement, FieldChoice } from "types";

export const ChoiceListField = ({
  name,
  type,
  label,
  choices,
  hint,
  nested,
  onChangeHandler,
  errorMessage,
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  const form = useFormContext();
  form.register(name);

  const formatChoices = (choices: FieldChoice[]) =>
    choices.map((choice: FieldChoice) => {
      const choiceObject: FieldChoice = { ...choice };
      const choiceChildren = choice?.children;
      if (choiceChildren) {
        const isNested = true;
        const formattedChildren = formFieldFactory(choiceChildren, isNested);
        choiceObject.checkedChildren = formattedChildren;
      }
      delete choiceObject.children;
      return choiceObject;
    });

  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";

  const parsedHint = hint && parseCustomHtml(hint);

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
  onChangeHandler: Function;
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
