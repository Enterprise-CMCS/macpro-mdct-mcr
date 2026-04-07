import {
  forwardRef,
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
  NOT_REPORTING_FIELD_ID,
  NOT_REPORTING_REASON_FIELD_ID,
  applyDisableAfterField,
  applyClearedHydrationAfterField,
  getClearedValueForField,
  getFieldElementsAfterField,
  hasSelectedOption,
  isNotReportingSelected,
  sortFormErrors,
  useStore,
} from "utils";

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

  // Only subscribe to the Not Reporting fields if this form actually contains the trigger.
  // This avoids unnecessary re-renders for unrelated forms.
  const hasNotReportingTriggerField: boolean = fields.some(
    (field: FormField | FormLayoutElement) =>
      isFieldElement(field) && field.id === NOT_REPORTING_FIELD_ID
  );

  const notReportingSelection = useWatch({
    control: form.control,
    name: NOT_REPORTING_FIELD_ID,
    disabled: !hasNotReportingTriggerField,
    defaultValue: [],
  });
  const notReportingReasonSelection = useWatch({
    control: form.control,
    name: NOT_REPORTING_REASON_FIELD_ID,
    disabled: !hasNotReportingTriggerField,
    defaultValue: [],
  });

  const notReportingChosen = isNotReportingSelected(notReportingSelection);
  const notReportingReasonChosen = hasSelectedOption(
    notReportingReasonSelection
  );
  const disableFieldsAfterNotReporting =
    notReportingChosen && notReportingReasonChosen;
  const notReportingDisabledReasonId = `${id}-not-reporting-disabled-reason`;

  // Used to force an update of the fields so that it reflects cleared values
  // immediately.
  const [notReportingClearEpoch, setNotReportingClearEpoch] = useState(0);
  const prevDisableFieldsAfterNotReporting = useRef<boolean>(false);

  useLayoutEffect(() => {
    if (!hasNotReportingTriggerField) return;

    // Only clear on the transition to "disabled".
    if (
      disableFieldsAfterNotReporting &&
      !prevDisableFieldsAfterNotReporting.current
    ) {
      const fieldsToClear = getFieldElementsAfterField(
        fields,
        NOT_REPORTING_FIELD_ID
      );

      for (const field of fieldsToClear) {
        const fieldName = field.groupId ?? field.id;
        form.setValue(fieldName, getClearedValueForField(field), {
          shouldValidate: false,
          shouldDirty: true,
        });
        form.clearErrors(fieldName);
      }

      setNotReportingClearEpoch((v) => v + 1);
    }

    prevDisableFieldsAfterNotReporting.current = disableFieldsAfterNotReporting;
  }, [
    disableFieldsAfterNotReporting,
    hasNotReportingTriggerField,
    fields,
    form,
  ]);

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

    /*
     * The following if statement is in response to this ticket: CMDCT-5446
     * While this likely should be done by adding a special "disabled"
     * property to each field in the form JSON, this was a quicker fix to
     * implement the necessary logic without needing to update and watch
     * across multiple files for the new property. If this logic needs to
     * be applied to more forms in the future, it would likely be worth
     * refactoring to add a new property to the form JSON.
     */

    // If the user indicates they're not reporting and provides a reason,
    // disable every subsequent top-level field.
    if (hasNotReportingTriggerField) {
      applyDisableAfterField(
        fieldsToRender,
        NOT_REPORTING_FIELD_ID,
        disableFieldsAfterNotReporting,
        notReportingDisabledReasonId
      );

      // Prevent cleared/disabled fields from re-hydrating from saved formData while
      // Not Reporting is active.
      if (disableFieldsAfterNotReporting) {
        applyClearedHydrationAfterField(fieldsToRender, NOT_REPORTING_FIELD_ID);
      }

      // Render a single disabled-reason message under the Not reporting field.
      const notReportingMessageField = fieldsToRender.find(
        (field) => isFieldElement(field) && field.id === NOT_REPORTING_FIELD_ID
      ) as FormField | undefined;
      if (notReportingMessageField) {
        notReportingMessageField.props ??= {};
        notReportingMessageField.props.disabledStateMessageId =
          notReportingDisabledReasonId;
        notReportingMessageField.props.disabledStateMessage =
          "Fields disabled because Not Reporting is selected";
        notReportingMessageField.props.showDisabledStateMessage =
          disableFieldsAfterNotReporting;
      }
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
        <Box sx={sx} key={`form-fields-${notReportingClearEpoch}`}>
          {renderFormFields(fields)}
        </Box>
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
