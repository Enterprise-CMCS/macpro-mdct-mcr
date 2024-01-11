import { AnyObject } from "./other";
import { ModalOverlayReportPageVerbiage, ReportPageShapeBase } from "./reports";

// FORM & FIELD STRUCTURE

export interface ModalOverlayReportPageShape extends ReportPageShapeBase {
  entityType: string;
  verbiage: ModalOverlayReportPageVerbiage;
  modalForm: FormJson;
  overlayForm?: FormJson;
  drawerForm?: never;
  form?: never;
}

export interface FormLayoutElement {
  id: string;
  type: string;
  props?: AnyObject;
}

export interface FormJson {
  id: string;
  fields: FormField[];
  options?: AnyObject;
  validation?: AnyObject;
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
  id: string;
  type: string;
  validation: string | FieldValidationObject;
  hydrate?: string;
  props?: AnyObject;
  choices?: FieldChoice[];
  repeat?: string;
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
