import { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { SingleInputDateField as CmsdsDateField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import {
  AnyObject,
  CustomHtmlElement,
  InputChangeEvent,
  ReportStatus,
} from "types";
import { checkDateCompleteness, parseCustomHtml, useUser } from "utils";
import { ReportContext } from "components";

export const DateField = ({
  name,
  label,
  hint,
  sxOverride,
  nested,
  autosave,
  ...props
}: Props) => {
  const [displayValue, setDisplayValue] = useState<string>("");
  const { full_name, state, userIsStateUser, userIsStateRep } =
    useUser().user ?? {};

  const { report, updateReport } = useContext(ReportContext);

  // get form context and register form field
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

  // update field display value and form field data on change
  const onChangeHandler = (rawValue: string, maskedValue: string) => {
    setDisplayValue(rawValue);
    const isValidDate = checkDateCompleteness(maskedValue);
    if (isValidDate || maskedValue === "") {
      form.setValue(name, maskedValue, { shouldValidate: true });
    }
  };

  // update form field data on blur
  const onBlurHandler = async (event: InputChangeEvent) => {
    if (autosave) {
      const { name, value } = event.target;
      if (userIsStateUser || userIsStateRep) {
        // check field data validity
        const fieldDataIsValid = await form.trigger(name);
        // if valid, use; if not, reset to default
        if (fieldDataIsValid) {
          const reportKeys = {
            state: state,
            id: report?.id,
          };
          const dataToWrite = {
            status: ReportStatus.IN_PROGRESS,
            lastAlteredBy: full_name,
            fieldData: { [name]: value },
          };
          await updateReport(reportKeys, dataToWrite);
        }
      }
    } else {
      const fieldValue = event.target.value;
      form.setValue(name, fieldValue, { shouldValidate: true });
    }
  };

  // prepare error message, hint, and classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[name]?.message;
  const parsedHint = hint && parseCustomHtml(hint);
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const labelClass = !label ? "no-label" : "";

  return (
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={`${labelClass} ${nestedChildClasses} date-field`}
    >
      <CmsdsDateField
        name={name}
        label={label || ""}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        value={displayValue}
        hint={parsedHint}
        errorMessage={errorMessage}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  hint?: CustomHtmlElement[];
  timetype?: string;
  nested?: boolean;
  autosave?: boolean;
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  // input box
  ".ds-c-single-input-date-field__field-wrapper": {
    maxWidth: "7rem",
  },
  // unlabelled child field hints
  "&.ds-c-choice__checkedChild.no-label": {
    ".ds-c-field__hint": {
      marginBottom: "0.25rem",
    },
  },
};
