import { useState, useEffect, useContext } from "react";
import { useFormContext } from "react-hook-form";
// components
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
import { ReportContext } from "components";
// utils
import {
  autosaveFieldData,
  getAutosaveFields,
  labelTextWithOptional,
  parseCustomHtml,
  useUser,
} from "utils";
import { InputChangeEvent, AnyObject, CustomHtmlElement } from "types";
import { EntityContext } from "components/reports/EntityProvider";

export const TextField = ({
  name,
  label,
  hint,
  placeholder,
  sxOverride,
  nested,
  autosave,
  styleAsOptional,
  ...props
}: Props) => {
  const defaultValue = "";
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);
  const { full_name, state } = useUser().user ?? {};
  const { report, updateReport } = useContext(ReportContext);
  const { entities, entityType, selectedEntity, updateEntities } =
    useContext(EntityContext);

  // get form context and register field
  const form = useFormContext();
  form.register(name);

  // set initial display value to form state field value or hydration value
  const hydrationValue = props?.hydrate || defaultValue;

  useEffect(() => {
    // if form state has value for field, set as display value
    const fieldValue = form.getValues(name);
    if (fieldValue) {
      setDisplayValue(fieldValue);
    }
    // else set hydrationValue or defaultValue as display value
    else if (hydrationValue) {
      if (props.clear) {
        setDisplayValue(defaultValue);
        form.setValue(name, defaultValue);
      } else {
        setDisplayValue(hydrationValue);
        form.setValue(name, hydrationValue);
      }
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

  // update display value and form field data on change
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { name, value } = event.target;
    setDisplayValue(value);
    form.setValue(name, value, { shouldValidate: true });
  };

  // if should autosave, submit field data on blur
  const onBlurHandler = async (event: InputChangeEvent) => {
    const { value } = event.target;
    // if field is blank, trigger client-side field validation error
    if (!value.trim()) form.trigger(name);
    // submit field data to database
    if (autosave) {
      const fields = getAutosaveFields({
        name,
        type: "number",
        value,
        defaultValue,
        hydrationValue,
        entityContext: {
          selectedEntity,
          entityType,
          updateEntities,
          entities,
        },
      });
      const reportArgs = {
        id: report?.id,
        reportType: report?.reportType,
        updateReport,
      };
      const user = { userName: full_name, state };
      await autosaveFieldData({
        form,
        fields,
        report: reportArgs,
        user,
      });
    }
  };

  // prepare error message, hint, and classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[name]?.message;
  const parsedHint = hint && parseCustomHtml(hint);
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const labelClass = !label ? "no-label" : "";
  const labelText =
    label && styleAsOptional ? labelTextWithOptional(label) : label;

  return (
    <Box sx={sxOverride} className={`${nestedChildClasses} ${labelClass}`}>
      <CmsdsTextField
        id={name}
        name={name}
        label={labelText || ""}
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
  styleAsOptional?: boolean;
  [key: string]: any;
}
