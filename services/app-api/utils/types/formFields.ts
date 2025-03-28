import { AnyObject } from "./other";

// FORM & FIELD STRUCTURE

export enum EntityType {
  // StandardReportPage entities
  PLANS = "plans",
  BSS_ENTITIES = "bssEntities",
  PROGRAM = "program",
  // DrawerReportPage entities
  ILOS = "ilos",
  ANALYSIS_METHODS = "analysisMethods",
  STANDARDS = "standards",
  // ModalDrawerReportPage entities
  ACCESS_MEASURES = "accessMeasures",
  QUALITY_MEASURES = "qualityMeasures",
  SANCTIONS = "sanctions",
}

export interface EntityShape {
  id: string;
  [key: string]: any;
}

/**
 * General type for all form JSON.
 */
export interface FormJson {
  id: string;
  fields: (FormField | FormLayoutElement)[];
  heading?: AnyObject;
  options?: AnyObject;
  validation?: AnyObject;
  /**
   * False for most forms, including all report forms.
   * True for the admin banner and dash selector.
   * Only exists on the UI side; the API is protected by routes.
   */
  editableByAdmins?: boolean;
}

export interface DependentFieldValidation {
  type: string;
  dependentFieldName: string;
  parentOptionId?: never;
}

export interface NestedFieldValidation {
  type: string;
  nested: true;
  parentFieldName: string;
  parentOptionId: string;
}

export interface NestedDependentFieldValidation {
  type: string;
  dependentFieldName: string;
  nested: true;
  parentFieldName: string;
  parentOptionId: string;
}

export type FieldValidationObject =
  | DependentFieldValidation
  | NestedFieldValidation
  | NestedDependentFieldValidation;

export interface FormField {
  [x: string]: any;
  id: string;
  type: string;
  validation: string | FieldValidationObject;
  hydrate?: string;
  props?: AnyObject;
  choices?: FieldChoice[];
  repeat?: string;
  groupId?: string;
}

export interface FormLayoutElement {
  id: string;
  type: string;
  props?: AnyObject;
  repeat?: string;
  groupId?: string;
}

export interface FieldChoice {
  id: string;
  name: string;
  label: string;
  value: string;
  checked?: boolean;
  children?: FormField[];
  checkedChildren?: any;
}
export interface Choice {
  key: string; // choice.name
  value: string; // choice.value
}

/**
 * Type for a selection radio or checklist option.
 */
export interface SelectedOption {
  label: string;
  value: string;
}

/**
 * All (most) of the possible field value types.
 */
export type FieldValue =
  | string
  | number
  | EntityShape
  | EntityShape[]
  | Choice
  | Choice[]
  | SelectedOption;

// HELPER FUNCTIONS

export function isLayoutElement(
  field: FormField | FormLayoutElement
): field is FormLayoutElement {
  return (field as FormField).validation === undefined;
}
