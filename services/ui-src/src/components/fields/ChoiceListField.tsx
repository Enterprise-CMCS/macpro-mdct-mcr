import { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
import { ReportContext } from "components";
// utils
import {
  autosaveFieldData,
  formFieldFactory,
  parseCustomHtml,
  useUser,
} from "utils";
import {
  AnyObject,
  Choice,
  CustomHtmlElement,
  FieldChoice,
  FormField,
  InputChangeEvent,
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
  const defaultValue: Choice[] = [];
  const [displayValue, setDisplayValue] = useState<Choice[]>(defaultValue);
  const [lastDatabaseValue, setLastDatabaseValue] =
    useState<Choice[]>(defaultValue);

  const { report, updateReport } = useContext(ReportContext);
  const { full_name, state } = useUser().user ?? {};
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
      setLastDatabaseValue(fieldValue);
    }
    // else if hydration value exists, set as display value
    else if (hydrationValue) {
      setDisplayValue(hydrationValue);
      setLastDatabaseValue(hydrationValue);
      form.setValue(name, hydrationValue);
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

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

  const clearUncheckedNestedFields = (choices: FieldChoice[]) => {
    choices.forEach((choice: FieldChoice) => {
      // if a choice is not selected and there are children, clear out any saved data
      if (choice.children) {
        choice.children.forEach((child) => {
          switch (child.type) {
            case "radio":
            case "checkbox":
              if (child.props?.choices) {
                child.props.choices.forEach((choice: FieldChoice) => {
                  choice.checked = false;
                  form.setValue(child.id, [], { shouldValidate: true });
                });
                clearUncheckedNestedFields(child.props.choices);
              }
              break;
            default:
              form.setValue(child.id, "", { shouldValidate: true });
              break;
          }
        });
      }
    });
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

    if (!isOptionChecked) {
      let option = choices.find((choice) => choice.id == clickedOption.key);
      clearUncheckedNestedFields([option!]);
    }

    // handle radio
    if (type === "radio") {
      selectedOptions = [clickedOption];
      setDisplayValue(selectedOptions);
      form.setValue(name, selectedOptions);
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
      form.setValue(name, selectedOptions, { shouldValidate: true });
    }
  };

  // if should autosave, submit field data to database on component blur
  const onComponentBlurHandler = () => {
    if (autosave) {
      const timeInMs = 200;
      // Timeout because the CMSDS ChoiceList component relies on timeouts to assert its own focus, and we're stuck behind its update
      setTimeout(async () => {
        const parentName = document.activeElement?.id.split("-")[0];
        if (
          parentName === name &&
          !document.activeElement?.id.includes("-otherText")
        )
          return; // Short circuit if still clicking on elements in this choice list
        let fields = [
          { name, type, value: displayValue, hydrationValue, defaultValue },
          ...getNestedChildFieldsOfUncheckedParent(choices, lastDatabaseValue),
        ];
        const reportArgs = { id: report?.id, updateReport };
        const user = { userName: full_name, state };
        await autosaveFieldData({
          form,
          fields,
          report: reportArgs,
          user,
        });
      }, timeInMs);
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

export const getNestedChildFieldsOfUncheckedParent = (
  choices: FieldChoice[],
  lastDatabaseValue: Choice[]
) => {
  // set up nested field compilation
  const nestedFields: any = [];
  const compileNestedFields = (fields: FormField[]) => {
    fields.forEach((field: FormField) => {
      // for each child field, get field info
      const fieldDefaultValue = ["radio", "checkbox"].includes(field.type)
        ? []
        : "";
      const fieldInfo = {
        name: field.id,
        type: field.type,
        value: fieldDefaultValue,
        overrideCheck: true,
      };
      // add to nested fields to be autosaved
      nestedFields.push(fieldInfo);
      // recurse through additional nested children as needed
      const fieldChoices = field.props?.choices;
      fieldChoices?.forEach(
        (choice: FieldChoice) =>
          choice.children && compileNestedFields(choice.children)
      );
    });
  };

  choices.forEach((choice: FieldChoice) => {
    // if choice is not selected and there are children
    const isParentChoiceChecked = (id: string) =>
      lastDatabaseValue?.some((autosave) => autosave.key === id);
    if (
      !choice.checked &&
      choice.children &&
      isParentChoiceChecked(choice.id)
    ) {
      compileNestedFields(choice.children);
    }
  });
  return nestedFields;
};
