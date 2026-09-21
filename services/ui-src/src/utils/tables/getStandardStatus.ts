// types
import {
  EntityShape,
  FieldChoice,
  FormField,
  FormLayoutElement,
  isFieldElement,
} from "types";
// utils
import { isFieldValidationOptional } from "utils";

const isValueEmpty = (value: any): boolean => {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
};

/*
 * Stored choice keys are prefixed with the parent field id ("fieldId-choiceId").
 * Some template choice ids already include that prefix, so match on either shape.
 */
const isChoiceSelected = (choice: FieldChoice, selected: any): boolean =>
  Array.isArray(selected) &&
  selected.some(
    (option: { key?: string }) =>
      option?.key === choice.id || option?.key?.endsWith(`-${choice.id}`)
  );

/**
 * Determines whether an entity has answered every required field in the given
 * form fields, including required child fields nested under selected choices.
 *
 * Used for the NAAAR standards table, where a standard copied from an older
 * report may be missing a specialty details field that has since become required.
 */
export const areRequiredFieldsComplete = (
  entity: EntityShape,
  fields: (FormField | FormLayoutElement)[] = []
): boolean =>
  fields.every((field) => {
    if (!isFieldElement(field)) return true;
    const value = entity[field.id];

    if (!isFieldValidationOptional(field) && isValueEmpty(value)) {
      return false;
    }

    const choices: FieldChoice[] = field.props?.choices || [];
    return choices
      .filter((choice) => choice.children && isChoiceSelected(choice, value))
      .every((choice) => areRequiredFieldsComplete(entity, choice.children));
  });

export const getStandardStatus = (
  standard: EntityShape,
  fields?: (FormField | FormLayoutElement)[]
): boolean => areRequiredFieldsComplete(standard, fields);
