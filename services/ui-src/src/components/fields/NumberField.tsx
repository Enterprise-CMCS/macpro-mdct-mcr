import React, { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { Box } from "@chakra-ui/react";
import { ReportContext, TextField } from "components";
// utils
import {
  applyCustomMask,
  autosaveFieldData,
  customMaskMap,
  getAutosaveFields,
  useUser,
} from "utils";
import { InputChangeEvent, AnyObject } from "types";
import { EntityContext } from "components/reports/EntityProvider";

export const NumberField = ({
  name,
  label,
  placeholder,
  mask,
  sxOverride,
  autosave,
  ...props
}: Props) => {
  const defaultValue = "";
  const [displayValue, setDisplayValue] = useState(defaultValue);
  const { entities, entityType, updateEntities, selectedEntity } =
    useContext(EntityContext);
  // get form context
  const form = useFormContext();
  const { report, updateReport } = useContext(ReportContext);
  const { full_name, state } = useUser().user ?? {};

  const fieldIsRegistered = name in form.getValues();

  if (mask === "currency") sx[".ds-c-field"].paddingLeft = "1.5rem";
  else if (mask === "percentage") sx[".ds-c-field"].paddingRight = "1.75rem";
  else {
    sx[".ds-c-field"].paddingLeft = ".5rem";
    sx[".ds-c-field"].paddingRight = ".5rem";
  }
  useEffect(() => {
    if (!fieldIsRegistered) {
      form.register(name);
    } else {
      form.trigger(name);
    }
  }, []);

  // set initial display value to form state field value or hydration value
  const hydrationValue = props?.hydrate || defaultValue;
  useEffect(() => {
    // if form state has value for field, set as display value
    const fieldValue = form.getValues(name);
    if (fieldValue) {
      const maskedFieldValue = applyCustomMask(fieldValue, mask);
      setDisplayValue(maskedFieldValue);
    }
    // else set hydrationValue or defaultValue display value
    else if (hydrationValue) {
      if (props.clear) {
        setDisplayValue(defaultValue);
        form.setValue(name, defaultValue);
      } else {
        const maskedHydrationValue = applyCustomMask(hydrationValue, mask);
        setDisplayValue(maskedHydrationValue);
        form.setValue(name, maskedHydrationValue, { shouldValidate: true });
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
    const maskedFieldValue = applyCustomMask(value, mask);
    setDisplayValue(maskedFieldValue);

    // submit field data to database
    if (autosave) {
      const fields = getAutosaveFields({
        name,
        type: "number",
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
  return (
    <Box sx={{ ...sx, ...sxOverride }}>
      <Box sx={sx.numberFieldContainer}>
        <TextField
          id={name}
          name={name}
          label={label || ""}
          placeholder={placeholder}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue}
          {...props}
        />
        <FieldOverlay
          fieldMask={mask}
          nested={props?.nested}
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
  mask?: keyof typeof customMaskMap;
  nested?: boolean;
  sxOverride?: AnyObject;
  autosave?: boolean;
  clear?: boolean;
  [key: string]: any;
}

export const FieldOverlay = ({
  fieldMask,
  nested,
  disabled,
}: FieldOverlayProps) => {
  switch (fieldMask) {
    case "percentage":
      return nested ? (
        <Box
          className={disabled ? "disabled" : undefined}
          sx={sx.nestedOverlayRight}
        >
          {" % "}
        </Box>
      ) : (
        <Box className={disabled ? "disabled" : undefined} sx={sx.overlayRight}>
          {" % "}
        </Box>
      );
    case "currency":
      return nested ? (
        <Box
          className={disabled ? "disabled" : undefined}
          sx={sx.nestedOverlayLeft}
        >
          {" $ "}
        </Box>
      ) : (
        <Box className={disabled ? "disabled" : undefined} sx={sx.overlayLeft}>
          {" $ "}
        </Box>
      );
    default:
      return <></>;
  }
};

interface FieldOverlayProps {
  fieldMask?: keyof typeof customMaskMap;
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
  },
  overlayRight: {
    position: "absolute",
    bottom: "11px",
    left: "213px",
    paddingTop: "1px",
    fontSize: "lg",
    fontWeight: "700",
  },
  nestedOverlayRight: {
    position: "absolute",
    bottom: "15px",
    left: "245px",
    paddingTop: "1px",
    fontSize: "lg",
    fontWeight: "700",
  },
  overlayLeft: {
    position: "absolute",
    bottom: "11px",
    left: "10px",
    paddingTop: "1px",
    fontSize: "lg",
    fontWeight: "700",
  },
  nestedOverlayLeft: {
    position: "absolute",
    bottom: "15px",
    left: "245px",
    paddingTop: "1px",
    fontSize: "lg",
    fontWeight: "700",
  },
};
