import React, { ReactNode, useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { Box, SystemStyleObject } from "@chakra-ui/react";
import { ReportContext, EntityContext } from "components";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
// constants
import { suppressionText } from "../../constants";
// types
import { InputChangeEvent } from "types";
// utils
import {
  applyMask,
  maskMap,
  autosaveFieldData,
  getAutosaveFields,
  labelTextWithOptional,
  parseCustomHtml,
  useStore,
  makeStringParseableForDatabase,
} from "utils";

export const NumberField = ({
  name,
  label,
  hint,
  placeholder,
  mask,
  sxOverride,
  autosave,
  validateOnRender,
  nested,
  styleAsOptional,
  clear,
  decimalPlacesToRoundTo,
  disabled,
  suppressed,
  suppressible,
  onChange,
  ...props
}: NumberFieldProps) => {
  const defaultValue = "";
  const [displayValue, setDisplayValue] = useState(defaultValue);
  // state management
  const { full_name, state } = useStore().user ?? {};
  const { report, entities, entityType, selectedEntity } = useStore();

  const { updateReport } = useContext(ReportContext);
  const { updateEntities } = useContext(EntityContext);

  // get form context and register field
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
      const maskedFieldValue = applyMask(
        fieldValue,
        mask,
        decimalPlacesToRoundTo
      ).maskedValue;
      setDisplayValue(maskedFieldValue);
    }
    // else set hydrationValue or defaultValue display value
    else if (hydrationValue) {
      if (clear) {
        setDisplayValue(defaultValue);
        form.setValue(name, defaultValue);
      } else {
        const formattedHydrationValue = applyMask(
          hydrationValue,
          mask,
          decimalPlacesToRoundTo
        );
        const maskedHydrationValue = formattedHydrationValue.maskedValue;
        setDisplayValue(maskedHydrationValue);

        // this value eventually gets sent to the database, so we need to make it parseable as a number again
        const cleanedFieldValue = formattedHydrationValue.isValid
          ? makeStringParseableForDatabase(maskedHydrationValue, mask)
          : maskedHydrationValue;
        form.setValue(name, cleanedFieldValue, { shouldValidate: true });
      }
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

  useEffect(() => {
    if (!suppressible) return;

    const unsuppressedText =
      hydrationValue === suppressionText ? "" : hydrationValue;
    // Don't hydrate suppressionText in text field if suppressed is false
    const value = suppressed === true ? suppressionText : unsuppressedText;
    setDisplayValue(value);
    form.setValue(name, value, { shouldValidate: false });
  }, [hydrationValue, suppressed, suppressible]);

  // update form data on change, but do not mask
  const onChangeHandler = async (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setDisplayValue(value);
    form.setValue(name, value, { shouldValidate: true });
    if (onChange) onChange(value);
  };

  // update display value with masked value; if should autosave, submit field data to database on blur
  const onBlurHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // if field is blank, trigger client-side field validation error
    if (!value.trim()) form.trigger(name);
    // mask value and set as display value
    const formattedFieldValue = applyMask(value, mask, decimalPlacesToRoundTo);
    const maskedFieldValue = formattedFieldValue.maskedValue;

    // this value eventually gets sent to the database, so we need to make it parseable as a number again
    const cleanedFieldValue = formattedFieldValue.isValid
      ? makeStringParseableForDatabase(maskedFieldValue, mask)
      : maskedFieldValue;
    form.setValue(name, cleanedFieldValue, { shouldValidate: true });
    setDisplayValue(maskedFieldValue);

    // submit field data to database (inline validation is run prior to API call)
    if (autosave) {
      const fields = getAutosaveFields({
        name,
        type: "number",
        value: cleanedFieldValue,
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

  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[name]?.message as ReactNode;
  const parsedHint = hint ? parseCustomHtml(hint) : undefined;
  const maskClass = mask || "";
  const labelText =
    label && styleAsOptional ? labelTextWithOptional(label) : label;
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";

  return (
    <Box sx={{ ...sx, ...sxOverride }} className={`${nestedChildClasses}`}>
      <Box sx={sx.numberFieldContainer} className={maskClass}>
        <CmsdsTextField
          id={name}
          name={name}
          label={labelText || ""}
          hint={parsedHint}
          placeholder={placeholder}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={suppressed ? "" : displayValue}
          errorMessage={errorMessage}
          disabled={disabled || suppressed}
          {...props}
        />
        <SymbolOverlay
          fieldMask={mask}
          nested={nested}
          disabled={disabled || suppressed}
        />
      </Box>
    </Box>
  );
};

export interface NumberFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  mask?: keyof typeof maskMap | null;
  nested?: boolean;
  sxOverride?: SystemStyleObject;
  autosave?: boolean;
  validateOnRender?: boolean;
  clear?: boolean;
  decimalPlacesToRoundTo?: number;
  suppressed?: boolean;
  suppressible?: boolean;
  onChange?: Function;
  [key: string]: any;
}

export const SymbolOverlay = ({
  fieldMask,
  nested,
  disabled,
}: SymbolOverlayProps) => {
  const symbolMap = { percentage: "%", currency: "$" };
  const symbol = fieldMask
    ? symbolMap[fieldMask as keyof typeof symbolMap]
    : undefined;
  const disabledClass = disabled ? "disabled" : "";
  const nestedClass = nested ? "nested" : "";
  return symbol ? (
    <Box
      className={`${disabledClass} ${nestedClass} `}
      sx={sx.symbolOverlay}
    >{` ${symbol} `}</Box>
  ) : (
    <></>
  );
};
interface SymbolOverlayProps {
  fieldMask?: keyof typeof maskMap | null;
  nested?: boolean;
  disabled?: boolean;
}

const sx = {
  ".ds-c-field": {
    maxWidth: "15rem",
    paddingLeft: "spacer1",
    paddingRight: "spacer1",
  },
  numberFieldContainer: {
    position: "relative",
    "&.currency": {
      ".ds-c-field": {
        paddingLeft: "spacer3",
      },
    },
    "&.percentage": {
      ".ds-c-field": {
        paddingRight: "1.75rem",
      },
    },
  },
  symbolOverlay: {
    position: "absolute",
    paddingTop: "1px",
    fontSize: "lg",
    fontWeight: "700",
    "&.nested": {
      bottom: "15px",
      left: "245px",
    },
    ".percentage &": {
      bottom: "11px",
      left: "213px",
    },
    ".currency &": {
      bottom: "11px",
      left: "10px",
    },
  },
};
