import { forwardRef, ReactNode, useEffect } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitErrorHandler,
  useForm,
} from "react-hook-form";
import { useLocation } from "react-router-dom";
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
  const fieldInputDisabled =
    ((userIsAdmin || userIsReadOnly) && !formJson.editableByAdmins) ||
    report?.status === ReportStatus.SUBMITTED;

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

    return formFieldFactory(fieldsToRender, {
      disabled: !!fieldInputDisabled,
      autosave,
      validateOnRender,
    });
  };

  useEffect(() => {
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
    marginBottom: "0.25rem",
  },
  // field hint and error message
  ".ds-c-hint, .ds-c-inline-error": {
    fontSize: "sm",
    ul: {
      gap: 0,
    },
    ol: {
      margin: "0.25rem 0.5rem",
      padding: "0.5rem",
    },
    a: {
      color: "primary",
      textDecoration: "underline",
    },
  },
  // nested child fields
  ".ds-c-choice__checkedChild.nested": {
    paddingY: "0.25rem",
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
    paddingTop: "1rem",
  },
  // fake styles for hints
  ".fake-paragraph-break": {
    display: "block",
    paddingTop: "0.25rem",
  },
  ".fake-list-item": {
    display: "block",
    paddingLeft: "1rem",
    textIndent: "-0.5rem",
  },
  ".fake-list-item:first-of-type, .fake-paragraph-break + .fake-list-item": {
    paddingTop: "0.25rem",
  },
  ".fake-list-item::before": {
    content: '"•"',
    fontWeight: "bold",
    display: "inline-block",
    width: ".5rem",
  },
  // fake list numbered style
  ".numbered": {
    counterIncrement: "item",
  },
  ".numbered::before": {
    content: 'counter(item) "."',
  },
};
