import { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { Dropdown as CmsdsDropdown } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
import { ReportContext } from "components";
// utils
import {
  autosaveFieldData,
  getAutosaveFields,
  labelTextWithOptional,
  parseCustomHtml,
  useUser,
  convertDateUtcToEt,
} from "utils";
import {
  AnyObject,
  DropdownChoice,
  DropdownOptions,
  EntityShape,
  InputChangeEvent,
  SelectedOption,
} from "types";
import { dropdownDefaultOptionText, dropdownNoReports } from "../../constants";
import { EntityContext } from "components/reports/EntityProvider";

export const DropdownField = ({
  name,
  label,
  options,
  hint,
  nested,
  autosave,
  validateOnRender,
  sxOverride,
  styleAsOptional,
  ...props
}: Props) => {
  const { report, updateReport, submittedReportsByState } =
    useContext(ReportContext);
  const { entities, entityType, updateEntities, selectedEntity } =
    useContext(EntityContext);
  const { full_name, state } = useUser().user ?? {};

  // fetch the option values and format them if necessary
  const formatOptions = (options: DropdownOptions[] | string) => {
    let dropdownOptions = [];
    if (options === "copyEligibleReports") {
      if (submittedReportsByState?.length == 0) {
        dropdownOptions.push({
          label: dropdownNoReports,
          value: "",
        });
      } else {
        dropdownOptions =
          submittedReportsByState?.map((option) => ({
            label: `${option.programName} ${convertDateUtcToEt(
              option.dueDate
            )}`,
            value: option.fieldDataId!,
          })) ?? [];
      }
    } else if (typeof options === "string") {
      dropdownOptions =
        report?.fieldData[options]?.map((option: EntityShape) => ({
          label: option.name,
          value: option.id,
        })) ?? [];
    } else {
      dropdownOptions = options;
    }

    if (dropdownOptions[0]?.value !== "") {
      dropdownOptions.splice(0, 0, {
        label: dropdownDefaultOptionText,
        value: "",
      });
    }
    return dropdownOptions;
  };

  const formattedOptions = formatOptions(options);
  const defaultValue = props?.hydrate || formattedOptions[0];
  const [displayValue, setDisplayValue] =
    useState<DropdownChoice>(defaultValue);

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
      setDisplayValue(fieldValue);
    }
    // else set hydrationValue or defaultValue as display value
    else if (hydrationValue) {
      setDisplayValue(hydrationValue);
      form.setValue(name, hydrationValue);
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

  // update form data
  const onChangeHandler = async (event: InputChangeEvent) => {
    const selectedOption: SelectedOption = {
      label: event.target.id,
      value: event.target.value,
    };
    setDisplayValue(selectedOption);
    form.setValue(name, selectedOption, { shouldValidate: true });
  };

  // update form field data & database data on blur
  const onBlurHandler = async (event: InputChangeEvent) => {
    const selectedOption = {
      label: event.target.id,
      value: event.target.value,
    };
    // if blanking field, trigger client-side field validation error
    if (selectedOption === defaultValue) form.trigger(name);
    // submit field data to database
    if (autosave) {
      const fields = getAutosaveFields({
        name,
        type: "dropdown",
        value: selectedOption,
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
  const errorMessage = formErrorState?.[name]?.value?.message;
  const parsedHint = hint && parseCustomHtml(hint);
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const labelClass = !label ? "no-label" : "";
  const labelText =
    label && styleAsOptional ? labelTextWithOptional(label) : label;

  return (
    <Box sx={sxOverride} className={`${nestedChildClasses} ${labelClass}`}>
      <CmsdsDropdown
        name={name}
        id={name}
        label={labelText || ""}
        options={formattedOptions}
        hint={parsedHint}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        errorMessage={errorMessage}
        value={displayValue?.value}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  hint?: any;
  options: DropdownOptions[] | string;
  nested?: boolean;
  autosave?: boolean;
  validateOnRender?: boolean;
  sxOverride?: AnyObject;
  styleAsOptional?: boolean;
  [key: string]: any;
}
