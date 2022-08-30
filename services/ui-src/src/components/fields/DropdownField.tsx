import { useFormContext } from "react-hook-form";
// components
import { Dropdown as CmsdsDropdown } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses, parseCustomHtml } from "utils";
import { InputChangeEvent, AnyObject, DropdownOptions } from "types";

export const DropdownField = ({
  name,
  label = "",
  options,
  hint,
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
  const parsedHint = hint && parseCustomHtml(hint);

  return (
    <Box sx={sxOverride} className={mqClasses}>
      <CmsdsDropdown
        name={name}
        id={name}
        label={label}
        options={options}
        hint={parsedHint}
        onChange={(e) => onChangeHandler(e)}
        errorMessage={errorMessage}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  options: DropdownOptions[];
  hint?: any;
  sxOverride?: AnyObject;
  [key: string]: any;
}
