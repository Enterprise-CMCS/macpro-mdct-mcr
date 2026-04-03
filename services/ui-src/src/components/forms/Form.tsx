import { forwardRef, ReactNode, useLayoutEffect } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitErrorHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { useLocation } from "react-router";
import { object as yupSchema } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// components
import { Box } from "@chakra-ui/react";
// types
import {
  AnyObject,
  FormJson,
  FormField,
  isFieldElement,
  FormLayoutElement,
  ReportStatus,
} from "types";
// utils
import {
  compileValidationJsonFromFields,
  formFieldFactory,
  hydrateFormFields,
  mapValidationTypesToSchema,
  sortFormErrors,
  useStore,
} from "utils";

const NOT_REPORTING_OPTION_ID = "37sMoqg5MNOb17KDCpTO1w";
const NOT_REPORTING_FIELD_ID = "measure_isReporting";
const NOT_REPORTING_REASON_FIELD_ID = "measure_isNotReportingReason";

const mergeAriaDescribedBy = (
  toAdd: string,
  existing?: string
): string | undefined => {
  /*
   * Our fields may already have an aria-describedby attribute with one or more IDs.
   * We want to merge in the new ID without creating duplicates and while preserving
   * any existing IDs. This function takes the existing aria-describedby value and
   * the new ID to add, and returns a merged string of IDs.
   */
  const existingStr = typeof existing === "string" ? existing.trim() : "";
  const existingIds = existingStr ? existingStr.split(/\s+/) : [];
  const ids = new Set([...existingIds, toAdd]);
  const merged = [...ids].join(" ").trim();
  return merged.length > 0 ? merged : undefined;
};

const isNotReportingSelected = (value: unknown): boolean => {
  if (!Array.isArray(value)) return false;
  return value.some((opt: any) => {
    const key = opt?.key;
    if (typeof key !== "string") return false;
    return (
      key === NOT_REPORTING_OPTION_ID || key.endsWith(NOT_REPORTING_OPTION_ID)
    );
  });
};

const hasSelectedOption = (value: unknown): boolean => {
  if (!Array.isArray(value)) return false;
  return value.length > 0;
};

const applyDisableAfterField = (
  fields: (FormField | FormLayoutElement)[],
  params: {
    triggerFieldId: string;
    disableAfter: boolean;
    disabledReasonId: string;
  }
) => {
  console.log("Applying disable after field with params:", params);
  console.log("Fields before applying disable:", fields);
  const { triggerFieldId, disableAfter, disabledReasonId } = params;
  const metaKey = "__notReportingDisableMeta";

  const triggerIndex = fields.findIndex(
    (field) => isFieldElement(field) && field.id === triggerFieldId
  );
  console.log("Trigger field index:", triggerIndex);
  if (triggerIndex === -1) return;

  for (let i = triggerIndex + 1; i < fields.length; i++) {
    const field = fields[i];
    if (!isFieldElement(field)) continue;

    field.props ??= {};
    const props: any = field.props;

    /*
     * Meta refers to information that will be stored directly on the field object
     * to help keep track of the original disabled state and aria-describedby
     * before we've modified them.
     */
    const meta: any = (field as any)[metaKey];

    if (disableAfter) {
      // Capture original disabled state and aria-describedby in meta if not already captured
      if (!meta) {
        (field as any)[metaKey] = {
          originalDisabled: props.disabled,
          originalAriaDescribedBy: props["aria-describedby"],
        };
      }
      // Apply disabled state and merge aria-describedby with the disabled reason ID
      props.disabled = true;
      props["aria-describedby"] = mergeAriaDescribedBy(
        disabledReasonId,
        props["aria-describedby"]
      );
    } else if (meta) {
      /*
       * Restore original disabled state and aria-describedby from meta because if disableAfter
       * is false and we've previously disabled the field, we want to revert to the original state
       */
      props.disabled = meta.originalDisabled;
      props["aria-describedby"] = meta.originalAriaDescribedBy;
      delete (field as any)[metaKey];
      if (props.disabled === undefined) delete props.disabled;
      if (props["aria-describedby"] === undefined)
        delete props["aria-describedby"];
      console.log(
        "Cleaned up meta from field:",
        JSON.parse(JSON.stringify(field))
      );
    }
  }
};

export const Form = forwardRef<HTMLFormElement, Props>(function Form(
  {
    id,
    formJson,
    name,
    onSubmit,
    onError,
    formData,
    validateOnRender,
    autosave,
    dontReset,
    children,
    ...props
  },
  ref?
) {
  const { fields, options } = formJson;

  // determine if fields should be disabled (based on admin roles )
  const { userIsAdmin, userIsReadOnly } = useStore().user ?? {};
  const { report } = useStore();

  let location = useLocation();
  const readUser = userIsAdmin || userIsReadOnly;
  const submittedReport = report?.status === ReportStatus.SUBMITTED;
  const fieldInputDisabled =
    !formJson.editableByAdmins && (readUser || submittedReport);

  // create validation schema
  const formValidationJson = compileValidationJsonFromFields(
    formJson.fields.filter(isFieldElement)
  );
  const formValidationSchema = mapValidationTypesToSchema(formValidationJson);
  const formResolverSchema = yupSchema(formValidationSchema || {});
  mapValidationTypesToSchema;
  // make form context
  const form = useForm({
    resolver: !fieldInputDisabled ? yupResolver(formResolverSchema) : undefined,
    shouldFocusError: false,
    mode: "onChange",
    ...(options as AnyObject),
  });

  const notReportingSelection = useWatch({
    control: form.control,
    name: NOT_REPORTING_FIELD_ID,
  });
  const notReportingReasonSelection = useWatch({
    control: form.control,
    name: NOT_REPORTING_REASON_FIELD_ID,
  });

  const notReportingChosen = isNotReportingSelected(notReportingSelection);
  const notReportingReasonChosen = hasSelectedOption(
    notReportingReasonSelection
  );
  const disableFieldsAfterNotReporting =
    notReportingChosen && notReportingReasonChosen;
  const notReportingDisabledReasonId = `${id}-not-reporting-disabled-reason`;

  // will run if any validation errors exist on form submission
  const onErrorHandler: SubmitErrorHandler<FieldValues> = (
    errors: AnyObject
  ) => {
    // sort errors in order of registration/page display
    const sortedErrors: string[] = sortFormErrors(formValidationSchema, errors);
    // focus the first error on the page and scroll to it
    const fieldToFocus = document.querySelector(
      `[name='${sortedErrors[0]}']`
    )! as HTMLElement;
    fieldToFocus?.scrollIntoView({ behavior: "smooth", block: "center" });
    fieldToFocus?.focus({ preventScroll: true });
  };

  // hydrate and create form fields using formFieldFactory
  const renderFormFields = (fields: (FormField | FormLayoutElement)[]) => {
    const fieldsToRender = hydrateFormFields(fields, formData);

    // If the user indicates they're not reporting and provides a reason,
    // disable every subsequent top-level field.
    applyDisableAfterField(fieldsToRender, {
      triggerFieldId: NOT_REPORTING_FIELD_ID,
      disableAfter: disableFieldsAfterNotReporting,
      disabledReasonId: notReportingDisabledReasonId,
    });

    // Render a single disabled-reason message under the Not reporting field.
    const notReportingField = fieldsToRender.find(
      (field) => isFieldElement(field) && field.id === NOT_REPORTING_FIELD_ID
    ) as FormField | undefined;
    if (notReportingField) {
      notReportingField.props ??= {};
      notReportingField.props.disabledStateMessageId =
        notReportingDisabledReasonId;
      notReportingField.props.disabledStateMessage =
        "Fields disabled because Not Reporting is selected";
      notReportingField.props.showDisabledStateMessage =
        disableFieldsAfterNotReporting;
    }

    return formFieldFactory(fieldsToRender, {
      disabled: !!fieldInputDisabled,
      autosave,
      validateOnRender,
    });
  };

  /*
   * useLayoutEffect fires before the browser repaints the screen
   *
   * Fixes an issue where some fields registered before the reset and some after.
   * We want a fresh form state before form fields render and
   * for every field on the page to register into the form.
   */
  useLayoutEffect(() => {
    if (!dontReset && !validateOnRender) {
      form?.reset();
    }
  }, [location?.pathname]);

  return (
    <FormProvider {...form}>
      <form
        id={id}
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmit as any, onError || onErrorHandler)}
        name={name || id}
        ref={ref}
        {...props}
      >
        <Box sx={sx}>{renderFormFields(fields)}</Box>
        {children}
      </form>
    </FormProvider>
  );
});

interface Props {
  id: string;
  formJson: FormJson;
  onSubmit: Function;
  validateOnRender: boolean;
  dontReset: boolean;
  name?: string;
  onError?: SubmitErrorHandler<FieldValues>;
  formData?: AnyObject;
  autosave?: boolean;
  children?: ReactNode;
  [key: string]: any;
}

const sx = {
  // default
  ".ds-c-field, .ds-c-label": {
    maxWidth: "32rem",
  },

  ".ds-c-field": {
    margin: "0.5rem 0 0.25rem",
  },

  // disabled field
  ".ds-c-field[disabled]": {
    color: "base",
  },
  // field hint
  ".ds-c-hint": {
    marginBottom: "spacer_half",
  },
  // field hint and error message
  ".ds-c-hint, .ds-c-inline-error": {
    fontSize: "sm",
    ul: {
      gap: 0,
    },
    ol: {
      margin: "0.25rem 0.5rem",
      padding: "spacer1",
    },
    a: {
      color: "primary",
      textDecoration: "underline",
    },
  },
  // nested child fields
  ".ds-c-choice__checkedChild.nested": {
    paddingY: "spacer_half",
    paddingTop: 0,
    ".ds-c-fieldset, label": {
      marginTop: 0,
    },
  },
  // optional text
  ".optional-text": {
    fontWeight: "lighter",
  },
  h1: {
    fontWeight: "bold",
    fontSize: "md",
    color: "base",
    paddingTop: "spacer2",
  },
  // fake styles for hints
  ".fake-paragraph-break": {
    display: "block",
    paddingTop: "spacer_half",
  },
  ".fake-list-item": {
    display: "block",
    paddingLeft: "spacer2",
    textIndent: "-0.5rem",
  },
  ".fake-list-item:first-of-type, .fake-paragraph-break + .fake-list-item": {
    paddingTop: "spacer_half",
  },
  ".fake-list-item::before": {
    content: '"•"',
    fontWeight: "bold",
    display: "inline-block",
    width: "spacer1",
  },
  // fake list numbered style
  ".numbered": {
    counterIncrement: "item",
  },
  ".numbered::before": {
    content: 'counter(item) "."',
  },
};
