import { useFormContext } from "react-hook-form";
// components
import { Dropdown as CmsdsDropdown } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "../../utils/useBreakpoint";
import { InputChangeEvent, StyleObject } from "utils/types/types";

export const Dropdown = ({
  name,
  label,
  options,
  defaultValue,
  sxOverrides,
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
    <Box sx={{ ...sx, ...sxOverrides }} className={mqClasses}>
      <CmsdsDropdown
        name={name}
        id={name}
        label={label}
        defaultValue={defaultValue}
        options={options}
        onChange={(e) => onChangeHandler(e)}
        errorMessage={errorMessage}
        {...props}
      />
    </Box>
  );
};

interface DropdownOptions {
  label: string;
  value: string;
}

interface Props {
  name: string;
  label: string;
  options: DropdownOptions[];
  defaultValue: string;
  sxOverrides?: StyleObject;
  [key: string]: any;
}

const sx = {};
