/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { Box } from "@chakra-ui/react";
import { ReportContext, EntityContext } from "components";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
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
// types
import { InputChangeEvent, AnyObject } from "types";

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
  ...props
}: Props) => {
  const defaultValue = "";
  const [displayValue, setDisplayValue] = useState(defaultValue);
  // state management
  const { full_name, state } = useStore().user ?? {};
  const { report } = useStore();

  const { updateReport } = useContext(ReportContext);
  const { entities, entityType, updateEntities, selectedEntity } =
    useContext(EntityContext);

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
        props?.decimalPlacesToRoundTo
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
          props?.decimalPlacesToRoundTo
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

  // update form data on change, but do not mask
  const onChangeHandler = async (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setDisplayValue(value);
    form.setValue(name, value, { shouldValidate: true });
  };

  // update display value with masked value; if should autosave, submit field data to database on blur
  const onBlurHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // if field is blank, trigger client-side field validation error
    if (!value.trim()) form.trigger(name);
    // mask value and set as display value
    const formattedFieldValue = applyMask(
      value,
      mask,
      props?.decimalPlacesToRoundTo
    );
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

  // prepare error message, hint, and classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[name]?.message;
  const parsedHint = hint && parseCustomHtml(hint);
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
          value={displayValue}
          errorMessage={errorMessage}
          {...props}
        />
        <SymbolOverlay
          fieldMask={mask}
          nested={nested}
          disabled={props?.disabled}
        />
      </Box>
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  mask?: keyof typeof maskMap | null;
  nested?: boolean;
  sxOverride?: AnyObject;
  autosave?: boolean;
  validateOnRender?: boolean;
  clear?: boolean;
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
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  numberFieldContainer: {
    position: "relative",
    "&.currency": {
      ".ds-c-field": {
        paddingLeft: "1.5rem",
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
