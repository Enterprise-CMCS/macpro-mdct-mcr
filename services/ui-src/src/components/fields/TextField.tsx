import { useFormContext } from "react-hook-form";
// components
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses, parseCustomHtml } from "utils";
import { InputChangeEvent, AnyObject, CustomHtmlElement } from "types";

export const TextField = ({
  name,
  label,
  hint,
  placeholder,
  sxOverride,
  nested,
  dynamic,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  // get the form context
  const form = useFormContext();

  // update form data
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { name, value } = event.target;
    form.setValue(name, value, { shouldValidate: true });
  };

  let errorMessage = "";
  const dynamicCheck = dynamic?.parentName && dynamic?.index;

  const formErrorState = form?.formState?.errors;

  if (dynamicCheck) {
    errorMessage =
      formErrorState?.[dynamic.parentName]?.[dynamic.index]?.message;
  } else {
    errorMessage = formErrorState?.[name]?.message;
  }

  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";

  const parsedHint = hint && parseCustomHtml(hint);

  return (
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={`${mqClasses} ${nestedChildClasses}`}
    >
      <CmsdsTextField
        id={name}
        name={name}
        label={label}
        hint={parsedHint}
        placeholder={placeholder}
        onChange={(e) => onChangeHandler(e)}
        errorMessage={errorMessage}
        inputRef={() => dynamic?.inputRef ?? form.register(name)}
        defaultValue={props?.hydrate}
        {...props}
      />
    </Box>
  );
};

interface dynamicFieldInput {
  parentName: string;
  index: number;
  inputRef: Function;
}
interface Props {
  name: string;
  label?: string;
  hint?: CustomHtmlElement[];
  placeholder?: string;
  sxOverride?: AnyObject;
  nested?: boolean;
  dynamic?: dynamicFieldInput;
  [key: string]: any;
}

const sx = {
  "&.nested": {
    label: {
      marginTop: 0,
    },
  },
};
