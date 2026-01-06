import { ReactNode, useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box, SystemStyleObject } from "@chakra-ui/react";
import { ReportContext, EntityContext } from "components";
// types
import { CustomHtmlElement, InputChangeEvent } from "types";
// utils
import {
  autosaveFieldData,
  labelTextWithOptional,
  parseCustomHtml,
  useStore,
  getAutosaveFields,
  checkDateMonthYearCompleteness,
} from "utils";

export const MonthYearField = ({
  name,
  label,
  hint,
  sxOverride,
  nested,
  autosave,
  validateOnRender,
  styleAsOptional,
  clear,
  ...props
}: Props) => {
  const defaultValue = "";
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);

  // state management
  const { full_name, state } = useStore().user ?? {};
  const { report, entities, entityType, selectedEntity } = useStore();

  const { updateReport } = useContext(ReportContext);
  const { updateEntities } = useContext(EntityContext);

  // get form context and register form field
  const form = useFormContext();
  const fieldIsRegistered = name in form.getValues();

  useEffect(() => {
    if (!fieldIsRegistered && !validateOnRender) {
      form.register(name);
    } else if (validateOnRender) {
      form.trigger(name);
    }
  }, []);

  const setFormattedDate = (date: string) => {
    const monthYearFormat = checkDateMonthYearCompleteness(date);
    if (monthYearFormat) {
      const { month, year } = monthYearFormat;
      setDisplayValue(`${month}/${year}`);
    } else {
      setDisplayValue(date);
    }
  };

  // set initial display value to form state field value or hydration value
  const hydrationValue = props?.hydrate || defaultValue;
  useEffect(() => {
    // if form state has value for field, set as display value
    const fieldValue = form.getValues(name);
    if (fieldValue) {
      setFormattedDate(fieldValue);
    }
    // else set hydrationValue or defaultValue as display value
    else if (hydrationValue) {
      if (clear) {
        setFormattedDate(defaultValue);
        form.setValue(name, defaultValue);
      } else {
        setFormattedDate(hydrationValue);
        form.setValue(name, hydrationValue, { shouldValidate: true });
      }
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

  // update display value and form field data on change
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { name, value } = event.target;
    setFormattedDate(value);
    form.setValue(name, value, { shouldValidate: true });
  };

  // if should autosave, submit field data to database on blur
  const onBlurHandler = async (event: InputChangeEvent) => {
    const { name, value } = event.target;
    // if field is blank, trigger client-side field validation error
    if (!value.trim()) form.trigger(name);
    // submit field data to database
    if (autosave) {
      const fields = getAutosaveFields({
        name,
        type: "dateMonthYear",
        value,
        defaultValue,
        hydrationValue,
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
        entityContext: {
          selectedEntity,
          entityType,
          updateEntities,
          entities,
        },
      });
    }
  };

  // prepare error message, hint, and classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[name]?.message as ReactNode;
  const parsedHint = hint ? parseCustomHtml(hint) : undefined;
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const labelClass = !label ? "no-label" : "";
  const labelText =
    label && styleAsOptional ? labelTextWithOptional(label) : label;

  return (
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={`${labelClass} ${nestedChildClasses}`}
    >
      <CmsdsTextField
        name={name}
        label={labelText || ""}
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
  validateOnRender?: boolean;
  sxOverride?: SystemStyleObject;
  styleAsOptional?: boolean;
  clear?: boolean;
  [key: string]: any;
}

const sx = {
  ".ds-c-field": {
    maxWidth: "7rem",
  },
};
