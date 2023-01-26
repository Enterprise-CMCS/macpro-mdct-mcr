import { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
import { ReportContext } from "components";
// utils
import {
  createDataToWrite,
  createReportKeys,
  formFieldFactory,
  parseCustomHtml,
  shouldAutosave,
  useUser,
} from "utils";
import {
  AnyObject,
  Choice,
  CustomHtmlElement,
  FieldChoice,
  InputChangeEvent,
  ReportStatus,
} from "types";

export const ChoiceListField = ({
  name,
  type,
  label,
  choices,
  hint,
  nested,
  autosave,
  sxOverride,
  ...props
}: Props) => {
  const [displayValue, setDisplayValue] = useState<Choice[] | null>(null);
  const [lastAutosaveValue, setLastAutosaveValue] = useState<Choice[] | null>(
    null
  );
  const { report, updateReport } = useContext(ReportContext);
  const { full_name, state, userIsStateUser, userIsStateRep } =
    useUser().user ?? {};
  // get form context and register field
  const form = useFormContext();
  form.register(name);

  const shouldDisableChildFields = !!props?.disabled;

  // set initial display value to form state field value or hydration value
  const hydrationValue = props?.hydrate;
  useEffect(() => {
    // if form state has value for field, set as display value
    const fieldValue = form.getValues(name);
    if (fieldValue) {
      setDisplayValue(fieldValue);
      setLastAutosaveValue(fieldValue);
    }
    // else if hydration value exists, set as display value
    else if (hydrationValue) {
      setDisplayValue(hydrationValue);
      setLastAutosaveValue(hydrationValue);
      form.setValue(name, hydrationValue, { shouldValidate: true });
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

  // update form field data and DOM display checked attribute
  useEffect(() => {
    if (displayValue) {
      form.setValue(name, displayValue, { shouldValidate: true });
      // update DOM choices checked status
      clearChildren(choices);
    }
  }, [displayValue]);

  const autosaveSelections = async (selectedOptions: Choice[] | null) => {
    const initialDataToSend: any = { [name]: selectedOptions };
    const cleanedDataToSend = clearChildren(choices, initialDataToSend);

    const reportKeys = createReportKeys(report?.id, state);
    const dataToWrite = createDataToWrite(
      ReportStatus.IN_PROGRESS,
      name,
      cleanedDataToSend,
      full_name
    );

    await updateReport(reportKeys, dataToWrite);
  };

  // format choices with nested child fields to render (if any)
  const formatChoices = (choices: FieldChoice[]) => {
    return choices.map((choice: FieldChoice) => {
      setCheckedOrUnchecked(choice);
      const choiceObject: FieldChoice = { ...choice };
      const choiceChildren = choice?.children;
      if (choiceChildren) {
        const isNested = true;
        const formattedChildren = formFieldFactory(choiceChildren, {
          disabled: shouldDisableChildFields,
          nested: isNested,
          autosave,
        });
        choiceObject.checkedChildren = formattedChildren;
      }
      delete choiceObject.children;
      return choiceObject;
    });
  };

  const autosaveContainsParentChoice = (value: string) =>
    lastAutosaveValue &&
    lastAutosaveValue.some((autosave) => autosave.value === value);

  const clearChildren = (choices: FieldChoice[], dataToSend?: AnyObject) => {
    choices.forEach((choice: FieldChoice) => {
      // if a choice is not selected and there are children, clear out any saved data
      if (!choice.checked && choice.children) {
        choice.children.forEach((child) => {
          switch (child.type) {
            case "radio":
            case "checkbox":
              form.setValue(child.id, [], { shouldValidate: true });
              if (dataToSend && autosaveContainsParentChoice(choice.value)) {
                dataToSend[child.id] = [];
              }
              if (child.props?.choices) {
                child.props.choices.forEach((choice: FieldChoice) => {
                  choice.checked = false;
                });
                clearChildren(child.props.choices);
              }
              break;
            default:
              form.setValue(child.id, "", { shouldValidate: true });
              if (dataToSend && autosaveContainsParentChoice(choice.value)) {
                dataToSend[child.id] = "";
              }
              break;
          }
        });
      }
    });
    return dataToSend;
  };

  const setCheckedOrUnchecked = (choice: FieldChoice) => {
    const checkedState = displayValue?.find(
      (option) => option.value === choice.value
    );
    choice.checked = !!checkedState;
  };

  // update field values
  const onChangeHandler = (event: InputChangeEvent) => {
    const clickedOption = { key: event.target.id, value: event.target.value };
    const isOptionChecked = event.target.checked;
    const preChangeFieldValues = displayValue || [];
    let selectedOptions = null;
    // handle radio
    if (type === "radio") {
      selectedOptions = [clickedOption];
      setDisplayValue(selectedOptions);
    }
    // handle checkbox
    if (type === "checkbox") {
      const checkedOptionValues = [...preChangeFieldValues, clickedOption];
      const uncheckedOptionValues = preChangeFieldValues.filter(
        (field) => field.value !== clickedOption.value
      );
      selectedOptions = isOptionChecked
        ? checkedOptionValues
        : uncheckedOptionValues;
      setDisplayValue(selectedOptions);
    }
  };

  // update field values
  const onComponentBlurHandler = async () => {
    const willAutosave = shouldAutosave(
      displayValue,
      lastAutosaveValue,
      autosave,
      userIsStateRep,
      userIsStateUser
    );
    if (willAutosave) {
      setLastAutosaveValue(displayValue);
      autosaveSelections(displayValue);
    }
  };

  // prepare error message, hint, and classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[name]?.message;
  const parsedHint = hint && parseCustomHtml(hint);
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const labelClass = !label ? "no-label" : "";

  return (
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={`${nestedChildClasses} ${labelClass}`}
    >
      <CmsdsChoiceList
        name={name}
        type={type}
        label={label || ""}
        choices={formatChoices(choices)}
        hint={parsedHint}
        errorMessage={errorMessage}
        onChange={onChangeHandler}
        onComponentBlur={onComponentBlurHandler}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  type: "checkbox" | "radio";
  label?: string;
  choices: FieldChoice[];
  hint?: CustomHtmlElement[];
  nested?: boolean;
  autosave?: boolean;
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  // checkboxes
  ".ds-c-choice[type='checkbox']:checked::after": {
    boxSizing: "content-box",
  },
};
