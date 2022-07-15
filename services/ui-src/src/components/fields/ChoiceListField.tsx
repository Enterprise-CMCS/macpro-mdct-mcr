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
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  // get the form context
  const form = useFormContext();

  // update form data
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { name: choiceListName, value: choiceListValue } = event.target;
    form.setValue(choiceListName, choiceListValue, { shouldValidate: true });
  };

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

  return (
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={`${
        nested ? "nested ds-c-choice__checkedChild" : ""
      } ${mqClasses}`}
    >
      <CmsdsChoiceList
        name={name}
        type={type}
        label={label}
        choices={formatChoices(choices)}
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
