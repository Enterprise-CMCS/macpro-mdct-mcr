import { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { SingleInputDateField as CmsdsDateField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { AnyObject, CustomHtmlElement, InputChangeEvent } from "types";
import {
  checkDateCompleteness,
  createDataToWrite,
  createReportKeys,
  parseCustomHtml,
  shouldAutosave,
  useUser,
  validateAndSetValue,
} from "utils";
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
  const defaultValue = "";
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);
  const [lastAutosaveValue, setLastAutosaveValue] =
    useState<string>(defaultValue);
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
      setLastAutosaveValue(fieldValue);
    }
    // else if hydration value exists, set as display value
    else if (hydrationValue) {
      setDisplayValue(hydrationValue);
      setLastAutosaveValue(hydrationValue);
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
    const { name, value } = event.target;
    const willAutosave = shouldAutosave(
      value,
      lastAutosaveValue,
      autosave,
      userIsStateRep,
      userIsStateUser
    );
    if (willAutosave) {
      setLastAutosaveValue(value);
      const submissionValue = await validateAndSetValue(form, name, value, "");
      const reportKeys = createReportKeys(report?.id, state);
      const dataToWrite = createDataToWrite(
        { [name]: submissionValue },
        full_name
      );
      await updateReport(reportKeys, dataToWrite);
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
