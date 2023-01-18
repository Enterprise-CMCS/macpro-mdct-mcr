import React, { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { Box } from "@chakra-ui/react";
import { TextField } from "./TextField";
// utils
import { applyCustomMask, customMaskMap, useUser, validCmsdsMask } from "utils";
import { InputChangeEvent, AnyObject, ReportStatus } from "types";
import { TextFieldMask as ValidCmsdsMask } from "@cmsgov/design-system/dist/types/TextField/TextField";
import { ReportContext } from "components";

export const NumberField = ({
  name,
  label,
  placeholder,
  mask,
  sxOverride,
  autosave,
  ...props
}: Props) => {
  const [displayValue, setDisplayValue] = useState("");

  const { full_name, state, userIsStateUser, userIsStateRep } =
    useUser().user ?? {};

  // get form context
  const form = useFormContext();

  const { report, updateReport } = useContext(ReportContext);

  // set initial display value to form state field value or hydration value
  const hydrationValue = props?.hydrate;
  useEffect(() => {
    // if form state has value for field, set as display value
    const fieldValue = form.getValues(name);
    if (fieldValue) {
      const maskedFieldValue = applyCustomMask(fieldValue, mask);
      setDisplayValue(maskedFieldValue);
    }
    // else if hydration value exists, set as display value
    else if (hydrationValue) {
      const maskedHydrationValue = applyCustomMask(hydrationValue, mask);
      setDisplayValue(maskedHydrationValue);
      form.setValue(name, maskedHydrationValue, { shouldValidate: true });
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

  // update form data on change, but do not mask
  const onChangeHandler = async (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setDisplayValue(value);
    form.setValue(name, value, { shouldValidate: true });
  };

  // update form data and display value on blur, using masked value
  const onBlurHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const maskedFieldValue = applyCustomMask(value, mask);
    setDisplayValue(maskedFieldValue);
    form.setValue(name, maskedFieldValue, { shouldValidate: true });
    if (autosave) {
      if (userIsStateUser || userIsStateRep) {
        // check field data validity
        const fieldDataIsValid = await form.trigger(name);
        // if valid, use; if not, reset to default
        const fieldValue = fieldDataIsValid ? maskedFieldValue : "";

        const reportKeys = {
          state: state,
          id: report?.id,
        };
        const dataToWrite = {
          status: ReportStatus.IN_PROGRESS,
          lastAlteredBy: full_name,
          fieldData: { [name]: fieldValue },
        };
        await updateReport(reportKeys, dataToWrite);
      }
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
          mask={validCmsdsMask(mask)}
          value={displayValue}
          {...props}
        />
        {mask === "percentage" && (
          <Box
            className={props.disabled ? "disabled" : undefined}
            sx={sx.percentage}
          >
            {" % "}
          </Box>
        )}
      </Box>
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  mask?: ValidCmsdsMask | keyof typeof customMaskMap;
  nested?: boolean;
  sxOverride?: AnyObject;
  autosave?: boolean;
  [key: string]: any;
}

const sx = {
  ".ds-c-field": {
    maxWidth: "15rem",
    paddingRight: "1.75rem",
  },
  numberFieldContainer: {
    position: "relative",
  },
  percentage: {
    position: "absolute",
    bottom: "11px",
    left: "213px",
    paddingTop: "1px",
    fontSize: "lg",
    fontWeight: "700",
    "&.disabled": {
      color: "palette.gray_light",
    },
  },
};
