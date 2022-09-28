import { useFormContext } from "react-hook-form";
// components
import { Choice as CmsdsChoice } from "@cmsgov/design-system";
import { Box, Text } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "utils";
import { InputChangeEvent, AnyObject } from "types";
import { useEffect, useState } from "react";

export const ChoiceField = ({ name, label, sxOverride, ...props }: Props) => {
  const mqClasses = makeMediaQueryClasses();
  const singleBoxClass = "single-box";

  const [displayValue, setDisplayValue] = useState<boolean>(false);

  // get the form context
  const form = useFormContext();
  form.register(name);

  // set initial display value to form state field value or hydration value
  const hydrationValue = props?.hydrate;
  useEffect(() => {
    // if form state has value for field, set as display value
    const fieldValue = form.getValues(name);
    if (fieldValue) {
      setDisplayValue(fieldValue);
    }
    // else if hydration value exists, set as display value
    else if (hydrationValue) {
      setDisplayValue(hydrationValue);
      form.setValue(name, hydrationValue, { shouldValidate: true });
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

  // update form data
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { name: choiceName } = event.target;
    form.setValue(choiceName, !displayValue, { shouldValidate: true });
    setDisplayValue(!displayValue);
  };

  const componentProps = { ...props, hydrate: "" };
  return (
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={`${mqClasses} ${singleBoxClass}`}
    >
      <Text sx={sx.label} id="label">
        {label}
      </Text>
      <CmsdsChoice
        name={name}
        label={<></>}
        aria-labelledby="label"
        type="checkbox"
        value={displayValue.toString()}
        onChange={(e) => onChangeHandler(e)}
        checked={displayValue}
        {...componentProps}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  // checkboxes
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
