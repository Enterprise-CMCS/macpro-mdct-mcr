import { ReactNode, useContext, useEffect, useState } from "react";
import { FieldValues, useFormContext, UseFormReturn } from "react-hook-form";
// components
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { Box, SystemStyleObject } from "@chakra-ui/react";
import { ReportContext, EntityContext } from "components";
// types
import {
  AutosaveField,
  Choice,
  CustomHtmlElement,
  FieldChoice,
  FormField,
  InputChangeEvent,
} from "types";
// utils
import {
  autosaveFieldData,
  formFieldFactory,
  getAutosaveFields,
  labelTextWithOptional,
  parseCustomHtml,
  useStore,
} from "utils";

export const ChoiceListField = ({
  name,
  type,
  label,
  choices,
  hint,
  nested,
  autosave,
  validateOnRender,
  sxOverride,
  styleAsOptional,
  clear,
  ...props
}: Props) => {
  const defaultValue: Choice[] = [];
  const [displayValue, setDisplayValue] = useState<Choice[]>(defaultValue);

  // context
  const { updateReport } = useContext(ReportContext);
  const { updateEntities } = useContext(EntityContext);

  // state management
  const { full_name, state, userIsAdmin, userIsReadOnly } =
    useStore().user ?? {};
  const { report, entities, entityType, selectedEntity } = useStore();

  // get form context and register field
  const form = useFormContext();
  const fieldIsRegistered = name in form.getValues();

  const shouldDisableChildFields =
    ((userIsAdmin || userIsReadOnly) && !!props?.disabled) || report?.locked;

  // set initial display value to form state field value or hydration value
  const hydrationValue = props?.hydrate;

  useEffect(() => {
    if (!fieldIsRegistered && !validateOnRender) {
      form.register(name);
    } else if (validateOnRender) {
      form.trigger(name);
    }
  }, []);

  useEffect(() => {
    // if form state has value for field, set as display value
    const fieldValue = form.getValues(name);
    if (fieldValue) {
      setDisplayValue(fieldValue);
    }
    // else if hydration value exists, set as display value
    else if (hydrationValue) {
      /*
       * Clear is sent down when a choicelist is a child of another choicelist and that parent (Or its
       * Parents and so forth) had its choice deselected or changed. When that happens the onChangeHandler
       * calls clearUncheckedNestedFields and will clear the value of any children underneath it.
       * However, the database won't know things are updated until the user has clicked off that parent
       * and blurred it so instead we can use this clear value so that the hydration value doesn't overwrite
       * what a user is actively doing.
       */
      if (clear) {
        clear = false;
        setDisplayValue(defaultValue);
        form.setValue(name, defaultValue);
      } else {
        setDisplayValue(hydrationValue);
        if (validateOnRender)
          form.setValue(name, hydrationValue, { shouldValidate: true });
        else form.setValue(name, hydrationValue);
      }
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

  // format choices with nested child fields to render (if any)
  const formatChoices = (choices: FieldChoice[]) => {
    return choices.map((choice: FieldChoice) => {
      const {
        id,
        name,
        label,
        hint,
        value,
        checked,
        children,
        checkedChildren,
      } = choice;

      // Limit format props to those allowed on DOM elements (defined in FieldChoice)
      const choiceObject: FieldChoice = {
        id,
        name,
        label,
        hint,
        value,
        checked,
        children,
        checkedChildren,
      };

      setCheckedOrUnchecked(choiceObject);

      if (children) {
        const isNested = true;
        const formattedChildren = formFieldFactory(children, {
          disabled: shouldDisableChildFields,
          nested: isNested,
          autosave,
          validateOnRender,
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
        choice.children.forEach((child: FormField) => {
          switch (child.type) {
            case "radio":
            case "checkbox":
              if (child.props?.choices) {
                child.props.choices.forEach((choice: FieldChoice) => {
                  choice.checked = false;
                });
                child.props = { ...child.props, clear: true };
                form.setValue(child.id, []);
                form.unregister(child.id);
                clearUncheckedNestedFields(child.props.choices);
              }
              break;
            case "date":
              if (child.props?.disabled) {
                break;
              } else {
                child.props = { ...child.props, clear: true };
                form.setValue(child.id, "");
                form.unregister(child.id);
                break;
              }
            default:
              child.props = { ...child.props, clear: true };
              form.setValue(child.id, "");
              form.unregister(child.id);
              break;
          }
        });
      }
    });
  };

  const setCheckedOrUnchecked = (choice: FieldChoice) => {
    const checkedState = displayValue?.find(
      (option) => option.value === choice.value || option.key === choice.id
    );
    choice.checked = !!checkedState;
  };

  // update field values
  const onChangeHandler = (event: InputChangeEvent) => {
    const clickedOption = { key: event.target.id, value: event.target.value };
    const isOptionChecked = event.target.checked;
    let selectedOptions = [];

    // handle radio
    if (type === "radio") {
      selectedOptions = [clickedOption];
      const everyOtherOption = choices.filter(
        (choice) => choice.id != clickedOption.key
      );
      clearUncheckedNestedFields(everyOtherOption);
    }

    // handle checkbox
    if (type === "checkbox") {
      selectedOptions = [...(form.getValues(name) || displayValue || [])];

      if (isOptionChecked) {
        selectedOptions.push(clickedOption);
      } else {
        selectedOptions = selectedOptions.filter(
          (field) => field.key !== clickedOption.key
        );
        const option = choices.filter(
          (choice) => choice.id === clickedOption.key
        );
        clearUncheckedNestedFields(option);
      }
    }

    setDisplayValue(selectedOptions);
    form.setValue(name, selectedOptions, { shouldValidate: true });
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

        const fields = getAutosaveFields({
          name,
          type,
          value: displayValue,
          defaultValue,
          hydrationValue,
        });

        const choicesWithNestedEnabledFields = choices.map((choice) => {
          if (choice.children) {
            return {
              ...choice,
              children: choice.children.filter(
                (child) => !child.props?.disabled
              ),
            };
          }
          return choice;
        });

        const combinedFields = [
          ...fields,
          ...getNestedChildFields(choicesWithNestedEnabledFields, form),
        ];

        const reportArgs = {
          id: report?.id,
          reportType: report?.reportType,
          fieldData: report?.fieldData,
          updateReport,
        };
        const user = { userName: full_name, state };
        await autosaveFieldData({
          form,
          fields: combinedFields,
          report: reportArgs,
          user,
          entityContext: {
            selectedEntity,
            entityType,
            updateEntities,
            entities,
          },
        });
      }, timeInMs);
    }
  };

  // prepare error message, hint, and classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[name]?.message as ReactNode;
  const parsedHint = hint ? parseCustomHtml(hint) : undefined;
  let parsedLabel = null;
  const containerClassNames = [];

  if (label) {
    parsedLabel = styleAsOptional
      ? labelTextWithOptional(label)
      : parseCustomHtml(label);
  } else {
    containerClassNames.push("no-label");
  }

  if (nested) {
    containerClassNames.push("nested");
    containerClassNames.push("ds-c-choice__checkedChild");
  }

  return (
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={containerClassNames.join(" ")}
    >
      <CmsdsChoiceList
        name={name}
        type={type}
        label={parsedLabel}
        choices={formatChoices(choices) as any}
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
  validateOnRender?: boolean;
  sxOverride?: SystemStyleObject;
  styleAsOptional?: boolean;
  clear?: boolean;
  [key: string]: any;
}

const sx = {
  // checkboxes
  ".ds-c-choice[type='checkbox']:checked::after": {
    boxSizing: "content-box",
  },
  ".ds-c-choice[type='checkbox']:checked:disabled::before": {
    boxShadow: "inset 0 0 4em 1em #A6A6A6;",
  },
};

export const getNestedChildFields = (
  choices: FieldChoice[],
  form: UseFormReturn<FieldValues, any>
): AutosaveField[] => {
  // set up nested field compilation
  const nestedFields: any = [];
  const compileNestedFields = (fields: FormField[]) => {
    fields.forEach((field: FormField) => {
      // for each child field, get field info
      const fieldDefaultValue = ["radio", "checkbox"].includes(field.type)
        ? []
        : "";

      const fieldInfo = getAutosaveFields({
        name: field.id,
        type: field.type,
        value: form.getValues(field.id) || fieldDefaultValue,
        overrideCheck: true,
        defaultValue: undefined,
        hydrationValue: undefined,
      })[0];
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
    // if choice has children
    if (choice.children) {
      compileNestedFields(choice.children);
    }
  });
  return nestedFields;
};
