import { useState, useEffect } from "react";
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
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  // get the form context
  const form = useFormContext();

  if (name === "apoc-a2a") {
    console.log("TextField -- apoc-a2a form.getValues:", form.getValues(name));
    console.log("TextField -- apoc-a2a props.hydrate:", props?.hydrate);
  }

  const [fieldValue, setFieldValue] = useState<string>(
    form.getValues(name) || props?.hydrate
  );

  useEffect(() => {
    if (props?.hydrate) {
      setFieldValue(props?.hydrate);
    }
  }, [props?.hydrate]);

  // update form data
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { name, value } = event.target;
    setFieldValue(value);
    form.setValue(name, value, { shouldValidate: true });
  };

  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[name]?.message;

  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const parsedHint = hint && parseCustomHtml(hint);

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
        value={fieldValue || ""}
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
