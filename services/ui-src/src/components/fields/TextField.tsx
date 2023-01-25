import { useState, useEffect, useContext } from "react";
import { useFormContext } from "react-hook-form";
// components
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
import { ReportContext } from "components";
// utils
import {
  createDataToWrite,
  createReportKeys,
  getFieldValue,
  parseCustomHtml,
  shouldAutosave,
  useUser,
} from "utils";
import {
  InputChangeEvent,
  AnyObject,
  CustomHtmlElement,
  ReportStatus,
} from "types";

export const TextField = ({
  name,
  label,
  hint,
  placeholder,
  sxOverride,
  nested,
  autosave,
  ...props
}: Props) => {
  const defaultValue = "";
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);

  /*
   * Last value is the last value that was submitted to Autosave. We only want to submit
   * To autosave if theres been a change
   */
  const [lastAutosaveValue, setLastAutosaveValue] =
    useState<string>(defaultValue);

  const { full_name, state, userIsStateUser, userIsStateRep } =
    useUser().user ?? {};
  const { report, updateReport } = useContext(ReportContext);

  // get form context and register field
  const form = useFormContext();
  form.register(name);

  // set initial display value to form state field value or hydration value
  const hydrationValue = props?.hydrate;
  useEffect(() => {
    // if form state has value for field, set as display value
    const fieldValue = form.getValues(name);
    if (fieldValue || fieldValue == "") {
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

  // update display value and form field data on change
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { name, value } = event.target;
    setDisplayValue(value);
    form.setValue(name, value, { shouldValidate: true });
  };

  // if should autosave, submit field data to database on blur
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
      setLastAutosaveValue(displayValue);
      const submissionValue = await getFieldValue(form, name, value);
      const reportKeys = createReportKeys(report?.id, state);
      const dataToWrite = createDataToWrite(
        ReportStatus.IN_PROGRESS,
        name,
        submissionValue,
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
    <Box sx={sxOverride} className={`${nestedChildClasses} ${labelClass}`}>
      <CmsdsTextField
        id={name}
        name={name}
        label={label || ""}
        hint={parsedHint}
        placeholder={placeholder}
        onChange={(e) => onChangeHandler(e)}
        onBlur={(e) => onBlurHandler(e)}
        errorMessage={errorMessage}
        value={displayValue}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  hint?: CustomHtmlElement[];
  placeholder?: string;
  sxOverride?: AnyObject;
  nested?: boolean;
  autosave?: boolean;
  [key: string]: any;
}
