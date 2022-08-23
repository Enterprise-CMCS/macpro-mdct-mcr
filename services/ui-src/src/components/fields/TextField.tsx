import { useFormContext } from "react-hook-form";
// components
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses, parseCustomHtml } from "utils";
import { InputChangeEvent, AnyObject, CustomHtmlElement } from "types";

export const TextField = ({
  name,
  label = "",
  hint,
  placeholder,
  sxOverride,
  nested,
  controlled,
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

  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[name]?.message;

  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const parsedHint = hint && parseCustomHtml(hint);

  const fieldValue = form.getValues(name) || props?.hydrate;

  return (
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={`${mqClasses} ${nestedChildClasses} ${
        label === "" ? "no-label" : ""
      }`}
    >
      <CmsdsTextField
        id={name}
        name={name}
        label={label}
        hint={parsedHint}
        placeholder={placeholder}
        onChange={(e) => onChangeHandler(e)}
        errorMessage={errorMessage}
        inputRef={() => form.register(name)}
        value={controlled ? fieldValue : undefined}
        defaultValue={controlled ? undefined : fieldValue}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  hint?: CustomHtmlElement[];
  placeholder?: string;
  sxOverride?: AnyObject;
  nested?: boolean;
  controlled?: string;
  [key: string]: any;
}

const sx = {
  "&.ds-c-choice__checkedChild": {
    "&.no-label": {
      paddingY: 0,
    },
  },
  "&.nested": {
    label: {
      marginTop: 0,
    },
  },
};
