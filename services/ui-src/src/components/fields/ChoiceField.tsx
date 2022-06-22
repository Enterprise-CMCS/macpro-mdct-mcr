import { useFormContext } from "react-hook-form";
// components
import { Choice as CmsdsChoice } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "../../utils/useBreakpoint";
import { InputChangeEvent, StyleObject } from "utils/types/types";

export const ChoiceField = ({
  name,
  type,
  value,
  label,
  sxOverrides,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  // get the form context
  const form = useFormContext();

  // update form data
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { name: choiceName, value: choiceValue } = event.target;
    form.setValue(choiceName, choiceValue, { shouldValidate: true });
  };

  return (
    <Box sx={{ ...sx, ...sxOverrides }} className={mqClasses}>
      <CmsdsChoice
        name={name}
        type={type}
        value={value}
        label={label}
        onChange={(e) => onChangeHandler(e)}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  type: "checkbox" | "radio";
  value: string;
  label?: string;
  sxOverrides?: StyleObject;
  [key: string]: any;
}

const sx = {};
