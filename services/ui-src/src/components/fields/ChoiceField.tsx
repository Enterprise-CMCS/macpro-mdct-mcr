import { useFormContext } from "react-hook-form";
// components
import { Choice as CmsdsChoice } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "utils";
import { InputChangeEvent, AnyObject } from "types";
import { useEffect, useState } from "react";

export const ChoiceField = ({
  name,
  type,
  value,
  label,
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

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

  console.log(form.getValues());

  const componentProps = {...props, hydrate:""}
  return (
    <Box sx={{ ...sx, ...sxOverride }} className={mqClasses}>
      <CmsdsChoice
        name={name}
        type="checkbox"
        value={displayValue.toString()}
        label={label}
        onChange={(e) => onChangeHandler(e)}
        checked={displayValue}
        {...componentProps}
      />
    </Box>
  );
};

interface Props {
  name: string;
  type: "checkbox" | "radio";
  value: string;
  label?: string;
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {};
