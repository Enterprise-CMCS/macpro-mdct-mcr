import { SystemStyleObject } from "@chakra-ui/react";
import React from "react";
import {
  AnyObject,
  DrawerReportPageShape,
  ModalOverlayReportPageShape,
  ReportShape,
} from "types";

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
  groupId?: string;
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
  hint?: string;
  checked?: boolean;
  children?: FormField[];
  checkedChildren?: React.ReactNode;
}

export interface ChoiceFieldProps {
  name: string;
  label: string;
  choices: FieldChoice[];
  sxOverride?: SystemStyleObject;
  [key: string]: any;
}
export interface Choice {
  key: string; // choice.name
  value: string; // choice.value
  id?: string; // choice.id
}

export interface DropdownChoice {
  label: string;
  value: string;
}

/**
 * Shape of autosave field input. Since autosave is atomic, it requires a special shape
 * to more easily validate field values.
 */
export interface AutosaveField {
  name: string;
  type: string;
  value: FieldValue;
  defaultValue?: FieldValue;
  hydrationValue?: FieldValue;
  overrideCheck?: boolean;
}

export interface getFormParams {
  route: DrawerReportPageShape | ModalOverlayReportPageShape;
  report?: ReportShape;
  isCustomEntityForm?: boolean;
  isAnalysisMethodsPage?: boolean;
  isReportingOnStandards?: boolean;
  ilos?: AnyObject[];
  reportingOnIlos?: boolean;
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

export function isFieldElement(
  field: FormField | FormLayoutElement
): field is FormField {
  /*
   * This function is duplicated in app-api/utils/formTemplates/formTemplates.ts
   * If you change it here, change it there!
   */
  const formLayoutElementTypes = [
    "sectionHeader",
    "sectionContent",
    "sectionDivider",
  ];
  return !formLayoutElementTypes.includes(field.type);
}

export function isLayoutElement(
  field: FormField | FormLayoutElement
): field is FormLayoutElement {
  return (field as FormField).validation === undefined;
}

export interface StandardData {
  count: number;
  standardType: string;
  description: string;
  provider: string;
  analysisMethods: string;
  region: string;
  population: string;
}

export interface PlanQuestion {
  question: string;
  answer: string | string[];
}

export interface PlanData {
  heading: string;
  questions: PlanQuestion[];
}
