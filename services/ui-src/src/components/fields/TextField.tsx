import { useFormContext } from "react-hook-form";
// components
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "utils";
import { InputChangeEvent, AnyObject } from "types";

export const TextField = ({
  name,
  label,
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

  const errorMessage =
    form?.formState?.errors?.[name]?.message ||
    form?.formState?.errors?.[dynamic?.parentName]?.[dynamic?.index]?.message;
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";

  return (
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={`${mqClasses} ${nestedChildClasses}`}
    >
      <CmsdsTextField
        id={name}
        name={name}
        label={label}
        placeholder={placeholder}
        onChange={(e) => onChangeHandler(e)}
        errorMessage={errorMessage}
        inputRef={() => dynamic?.inputRef || form.register(name)}
        defaultValue={props?.hydrate}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  nested?: boolean;
  sxOverride?: AnyObject;
  dynamic?: AnyObject;
  [key: string]: any;
}

const sx = {
  "&.nested": {
    label: {
      marginTop: 0,
    },
  },
};
