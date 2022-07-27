import { useFormContext } from "react-hook-form";
// components
import { Dropdown as CmsdsDropdown } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "utils";
import { InputChangeEvent, AnyObject } from "types";

export const DropdownField = ({
  name,
  label,
  options,
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  // get the form context
  const form = useFormContext();

  // update form data
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { name: dropdownName, value: dropdownValue } = event.target;
    form.setValue(dropdownName, dropdownValue, { shouldValidate: true });
  };

  const errorMessage = form?.formState?.errors?.[name]?.message;

  return (
    <Box sx={{ ...sx, ...sxOverride }} className={mqClasses}>
      <CmsdsDropdown
        name={name}
        id={name}
        label={label}
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
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {};
