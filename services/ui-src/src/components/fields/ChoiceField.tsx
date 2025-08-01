import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { Choice as CmsdsChoice } from "@cmsgov/design-system";
import { Box, Text } from "@chakra-ui/react";
// types
import { AnyObject } from "types";
// utils
import { labelTextWithOptional } from "utils";

export const ChoiceField = ({
  name,
  label,
  hint,
  sxOverride,
  styleAsOptional,
  hydrate,
  inline,
  onChange,
}: Props) => {
  const [checkboxState, setCheckboxState] = useState<boolean>(false);

  // get the form context
  const form = useFormContext();
  form.register(name);

  // update form data and checkbox state
  const onChangeHandler = async () => {
    form.setValue(name, !checkboxState, { shouldValidate: true });
    setCheckboxState(!checkboxState);
    if (onChange) onChange(!checkboxState);
  };

  // set initial checkbox value to form state field value or hydration value
  useEffect(() => {
    // if form state has value for field, set as checkbox value
    const fieldValue = form.getValues(name);
    if (fieldValue) {
      setCheckboxState(fieldValue);
    }
    // else if hydration value exists, set as checkbox value and form field value
    else if (hydrate) {
      setCheckboxState(hydrate);
      form.setValue(name, hydrate, { shouldValidate: true });
    }
  }, [hydrate]);

  const labelText =
    label && styleAsOptional ? labelTextWithOptional(label) : label;
  const inputLabel = inline ? labelText : null;
  const legendLabel = inline ? null : labelText;
  const ariaLabel = inline ? {} : { "aria-labelledby": name };

  return (
    <Box sx={{ ...sx, ...sxOverride }}>
      {legendLabel && (
        <Text sx={sx.label} id={name}>
          {legendLabel}
        </Text>
      )}
      <CmsdsChoice
        type="checkbox"
        name={name}
        hint={hint}
        onChange={onChangeHandler}
        checked={checkboxState}
        label={inputLabel}
        value={checkboxState.toString()}
        {...ariaLabel}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  hint: string;
  sxOverride?: AnyObject;
  styleAsOptional?: boolean;
  hydrate?: boolean;
  inline?: boolean;
  onChange?: Function;
}

const sx = {
  ".ds-c-choice[type='checkbox']:checked::after": {
    boxSizing: "content-box",
  },
  label: {
    fontWeight: "bold",
    fontSize: "md",
    marginTop: "1.5rem",
  },
  ".ds-c-hint": {
    marginTop: "-.5rem",
    marginLeft: ".25rem",
  },
};
