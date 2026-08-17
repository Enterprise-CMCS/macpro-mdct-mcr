import { ReactNode, useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import {
  SingleInputDateField as CmsdsDateField,
  Label,
  Hint,
  InlineError,
} from "@cmsgov/design-system";
import { Box, SystemStyleObject, Text } from "@chakra-ui/react";
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
} from "utils";

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
  warningMessage,
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
  const parsedHint = hint ? parseCustomHtml(hint) : undefined;
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const labelClass = !label ? "no-label" : "";
  const labelText =
    label && styleAsOptional ? labelTextWithOptional(label) : label;

  // Determine what message to show - error takes precedence, then warning
  const messageToShow =
    errorMessage || (warningMessage && !errorMessage ? warningMessage : null);
  const isError = !!errorMessage;
  const isWarning = !errorMessage && !!warningMessage;

  // Manually add warning message to the field
  if (messageToShow) {
    return (
      <Box
        sx={{ ...sx, ...sxOverride }}
        className={`${labelClass} ${nestedChildClasses} date-field`}
      >
        <Label htmlFor={name} id={`${name}-label`}>
          {labelText || ""}
        </Label>

        {parsedHint && <Hint id={`${name}-hint`}>{parsedHint}</Hint>}

        {isError && (
          <InlineError id={`${name}__error`}>{errorMessage}</InlineError>
        )}
        {isWarning && (
          <Text
            sx={sx.warningText}
            className="ds-c-field__warning"
            role="alert"
          >
            {warningMessage}
          </Text>
        )}

        <CmsdsDateField
          name={name}
          id={name}
          label=""
          hint=""
          errorMessage=""
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue}
          aria-describedby={`${name}-hint`}
          {...props}
        />
      </Box>
    );
  }

  // Default CmsdsDateField
  return (
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={`${labelClass} ${nestedChildClasses} date-field`}
    >
      <CmsdsDateField
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
  warningMessage?: string;
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
    fontWeight: "lighter",
  },

  warningText: {
    display: "block",
    fontSize: "sm",
    color: "#F8C41F",
    marginTop: "0.25rem",
    marginBottom: "0.5rem",
    fontWeight: "bold",
  },
};
