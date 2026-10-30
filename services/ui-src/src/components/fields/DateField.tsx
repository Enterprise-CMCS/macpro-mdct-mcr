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

  // update field display value and form field data on change
  const onChangeHandler = (rawValue: string, maskedValue: string) => {
    setDisplayValue(rawValue);
    form.setValue(name, maskedValue, { shouldValidate: true });
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
