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

  const errorMessage = form?.formState?.errors?.[name]?.message;

  return (
    <Box sx={{ ...sx, ...sxOverride }} className={mqClasses}>
      <CmsdsTextField
        name={name}
        id={name}
        label={label}
        placeholder={placeholder}
        onChange={(e) => onChangeHandler(e)}
        errorMessage={errorMessage}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  ".ds-c-field": {
    maxWidth: "40rem",
  },
};
