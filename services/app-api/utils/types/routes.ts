import { EntityType } from "./formFields";
import { PageTypes } from "./other";
import { ReportType } from "./reports";
import {
  EndDateValidation,
  NestedValidation,
  ValidationType,
} from "./validations";

export interface ReportJsonFile {
  basePath: string;
  entities: Record<string, { required: boolean }>;
  name: string;
  routes: (
    | DrawerFormRoute
    | FormRoute
    | MultiformRoute
    | PageRoute
    | ParentRoute
  )[];
  type: ReportType;
  version: string;
}

// Forms
export interface ReportForm {
  id: string;
  fields: ReportFormField[];
  optional?: boolean;
}

export enum ReportFormFieldType {
  CHECKBOX = "checkbox",
  DATE = "date",
  DROPDOWN = "dropdown",
  DYNAMIC = "dynamic",
  NUMBER = "number",
  NUMBER_SUPPRESSIBLE = "numberSuppressible",
  RADIO = "radio",
  SECTION_CONTENT = "sectionContent",
  SECTION_DIVIDER = "sectionDivider",
  SECTION_HEADER = "sectionHeader",
  TEXT = "text",
  TEXTAREA = "textarea",
}

export interface ReportFormField {
  id: string;
  groupId?: string;
  props?: ReportFormFieldProps;
  repeat?: string;
  type: ReportFormFieldType;
  validation?: ValidationType | EndDateValidation;
}

export interface ReportFormFieldProps {
  choices?: {
    id: string;
    hint?: any;
    label: string;
    children?: {
      id: string;
      props?: {
        choices?: any[];
        decimalPlacesToRoundTo?: number;
        clear?: boolean;
        disabled?: boolean;
        hint?: any;
        label?: string;
        mask?: string;
        styleAsOptional?: boolean;
        timetype?: string;
      };
      styleAsOptional?: boolean;
      type: ReportFormFieldType;
      validation?: NestedValidation;
    }[];
  }[];
  content?: string;
  decimalPlacesToRoundTo?: number;
  disabled?: boolean;
  divider?: string;
  hint?: any;
  isRequired?: boolean;
  label?: string;
  mask?: string;
  options?: string;
  styleAsOptional?: boolean;
  timetype?: string;
}

// Routes
export interface BaseRoute {
  name: string;
  path: string;
  verbiage?: any;
}

export interface ParentRoute extends BaseRoute {
  children: (
    | DrawerFormRoute
    | FormRoute
    | ModalDrawerRoute
    | ModalOverlayRoute
    | ParentRoute
  )[];
}

export interface PageRoute extends BaseRoute {
  pageType: PageTypes;
}

export interface FormRoute extends BaseRoute {
  entityType?: EntityType;
  form: ReportForm;
  pageType: PageTypes;
}

export interface DrawerFormRoute extends BaseRoute {
  drawerForm: ReportForm;
  entityType: EntityType;
  pageType: PageTypes;
}

export interface AddEntityDrawerFormRoute extends DrawerFormRoute {
  addEntityDrawerForm: ReportForm;
}

export interface FormDrawerFormRoute extends DrawerFormRoute {
  form: ReportForm;
}

export interface ModalOverlayRoute extends BaseRoute {
  entityType: EntityType;
  modalForm: ReportForm;
  overlayForm: ReportForm;
  pageType: PageTypes;
}

export interface ModalDrawerRoute extends BaseRoute {
  entityType: EntityType;
  modalForm: ReportForm;
  drawerForm: ReportForm;
  pageType: PageTypes;
}

// TODO: Type details
export interface MultiformRoute extends BaseRoute {
  details: {
    verbiage: any;
    forms: {
      form: ReportForm;
      table: any;
      verbiage: any;
    }[];
    childForms: {
      form: ReportForm;
      parentForm: string;
      table?: any;
      verbiage: any;
    }[];
  };
  entityType: EntityType;
  pageType: PageTypes;
}
