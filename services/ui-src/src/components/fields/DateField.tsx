import { ReactNode, useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import {
  SingleInputDateField as CmsdsDateField,
  Label,
  Hint,
  InlineError,
} from "@cmsgov/design-system";
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
  fieldWarningLayoutSx,
  useFieldWarning,
  fieldWarningActiveSx,
  validNAValues,
} from "utils";

import { WarningMessage } from "utils/warnings/WarningMessage";

export const DateField = ({
  name,
  label,
  hint,
  sxOverride,
  nested,
  autosave,
  validateOnRender,
  styleAsOptional,
  clear,
  allowNa,
  ...props
}: Props) => {
  const defaultValue = "";
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);
  const [remountKey, setRemountKey] = useState<number>(0);

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
      if (clear) {
        setDisplayValue(defaultValue);
        form.setValue(name, defaultValue);
      } else {
        setDisplayValue(hydrationValue);
        form.setValue(name, hydrationValue, { shouldValidate: true });
      }
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

  // only treat N/A specially when the field opts in via allowNa
  const isNa = (value: string) => !!allowNa && validNAValues.includes(value);

  // update field display value and form field data on change
  const onChangeHandler = (rawValue: string, maskedValue: string) => {
    // on blur the date input reports '' for text it can't parse; keep a typed N/A
    const clearedByBlur =
      rawValue === "" &&
      isNa(displayValue) &&
      document.activeElement?.id !== name;
    if (clearedByBlur) return;
    setDisplayValue(rawValue);
    form.setValue(name, isNa(rawValue) ? rawValue : maskedValue, {
      shouldValidate: true,
    });
  };

  // if should autosave, submit field data to database on blur
  const onBlurHandler = async (event: InputChangeEvent) => {
    const { name } = event.target;
    // the date input blanks its own text on blur, so prefer the form value for N/A
    const formValue = form.getValues(name);
    const keepNa = isNa(formValue);
    const value = keepNa ? formValue : event.target.value;
    // if field is blank, trigger client-side field validation error
    if (!value.trim()) form.trigger(name);
    // remount so the date input shows the N/A we kept in state
    if (keepNa) setRemountKey((key) => key + 1);
    // submit field data to database
    if (autosave) {
      const fields = getAutosaveFields({
        name,
        type: "date",
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
  const warningMessage = useFieldWarning(name);
  const parsedHint = hint ? parseCustomHtml(hint) : undefined;
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const labelClass = !label ? "no-label" : "";
  const labelText =
    label && styleAsOptional ? labelTextWithOptional(label) : label;

  const isWarning = !errorMessage && !!warningMessage && !props?.disabled;

  return (
    <Box
      sx={{
        ...sx,
        ...sxOverride,
        ...fieldWarningLayoutSx,
        ...(isWarning ? fieldWarningActiveSx : {}),
      }}
      className={`${labelClass} ${nestedChildClasses} date-field`}
    >
      <Label htmlFor={name} id={`${name}-label`}>
        {labelText || ""}
      </Label>
      {parsedHint && <Hint id={`${name}-hint`}>{parsedHint}</Hint>}
      <InlineError id={`${name}__error`} />
      {isWarning && (
        <WarningMessage message={warningMessage} id={`${name}__warning`} />
      )}
      <CmsdsDateField
        key={remountKey}
        id={name}
        name={name}
        label=""
        hint=""
        errorMessage={errorMessage}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        value={displayValue}
        aria-describedby={
          [
            parsedHint ? `${name}-hint` : "",
            isWarning ? `${name}__warning` : "",
          ]
            .filter(Boolean)
            .join(" ") || undefined
        }
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  hint?: CustomHtmlElement[];
  nested?: boolean;
  autosave?: boolean;
  validateOnRender?: boolean;
  sxOverride?: SystemStyleObject;
  styleAsOptional?: boolean;
  clear?: boolean;
  allowNa?: boolean;
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
      marginBottom: "spacer_half",
    },
  },
  ".optional-text": {
    fontWeight: "heading_sm_regular",
  },
};
