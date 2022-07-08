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

  // get the form context
  const form = useFormContext();

  // update form data
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { name: choiceListName, value: choiceListValue } = event.target;
    form.setValue(choiceListName, choiceListValue, { shouldValidate: true });
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

interface ChoiceListChoices {
  label: string;
  value: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}

interface Props {
  name: string;
  type: "checkbox" | "radio";
  label: string;
  choices: ChoiceListChoices[];
  sxOverride?: AnyObject;
  [key: string]: any;
}
