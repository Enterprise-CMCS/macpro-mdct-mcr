import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { Choice as CmsdsChoice } from "@cmsgov/design-system";
import { Box, Text } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "utils";
import { AnyObject } from "types";

export const ChoiceField = ({
  name,
  label,
  hint,
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  const [checkboxState, setCheckboxState] = useState<boolean>(false);

  // get the form context
  const form = useFormContext();
  form.register(name);

  // update form data and checkbox state
  const onChangeHandler = async () => {
    form.setValue(name, !checkboxState, { shouldValidate: true });
    setCheckboxState(!checkboxState);
  };

  // set initial checkbox value to form state field value or hydration value
  const hydrationValue = props?.hydrate;
  useEffect(() => {
    // if form state has value for field, set as checkbox value
    const fieldValue = form.getValues(name);
    if (fieldValue) {
      setCheckboxState(fieldValue);
    }
    // else if hydration value exists, set as checkbox value and form field value
    else if (hydrationValue) {
      setCheckboxState(hydrationValue);
      form.setValue(name, hydrationValue, { shouldValidate: true });
    }
  }, [hydrationValue]);

  return (
    <Box sx={{ ...sx, ...sxOverride }} className={mqClasses}>
      <Text sx={sx.label} id="label">
        {label}
      </Text>
      <CmsdsChoice
        type="checkbox"
        name={name}
        hint={hint}
        onChange={onChangeHandler}
        checked={checkboxState}
        aria-labelledby="label"
        // required by component library, but unused
        label={<></>}
        value={checkboxState.toString()}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  hint: string;
  sxOverride?: AnyObject;
  [key: string]: any;
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
  ".ds-c-field__hint": {
    marginTop: "-.5rem",
    marginLeft: ".25rem",
  },
};
