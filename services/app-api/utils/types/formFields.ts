import { AnyObject } from "./other";
import { ModalOverlayReportPageVerbiage, ReportPageShapeBase } from "./reports";

// FORM & FIELD STRUCTURE

export declare type EntityType =
  | "plans"
  | "bssEntities"
  | "accessMeasures"
  | "qualityMeasures"
  | "sanctions";

export enum ModalDrawerEntityTypes {
  ACCESS_MEASURES = "accessMeasures",
  QUALITY_MEASURES = "qualityMeasures",
  SANCTIONS = "sanctions",
}

export interface ModalOverlayReportPageShape extends ReportPageShapeBase {
  entityType: string;
  verbiage: ModalOverlayReportPageVerbiage;
  modalForm: FormJson;
  overlayForm?: FormJson;
  drawerForm?: never;
  form?: never;
}

export interface EntityShape {
  id: string;
  [key: string]: any;
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

export interface DropdownOptions {
  label: string;
  value: string;
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

export interface ChoiceFieldProps {
  name: string;
  label: string;
  choices: FieldChoice[];
  sxOverride?: AnyObject;
  [key: string]: any;
}
export interface Choice {
  key: string; // choice.name
  value: string; // choice.value
}

export interface DropdownChoice {
  label: string;
  value: string;
}

export enum PageTypes {
  STANDARD = "standard",
  DRAWER = "drawer",
  MODAL_DRAWER = "modalDrawer",
  REVIEW_SUBMIT = "reviewSubmit",
}
