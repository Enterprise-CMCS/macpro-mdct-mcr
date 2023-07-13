import { ReactNode, useContext } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitErrorHandler,
  useForm,
} from "react-hook-form";
import { object as yupSchema } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// components
import { Box } from "@chakra-ui/react";
// utils
import {
  compileValidationJsonFromFields,
  formFieldFactory,
  hydrateFormFields,
  mapValidationTypesToSchema,
  sortFormErrors,
  useUser,
} from "utils";
import {
  AnyObject,
  FormJson,
  FormField,
  isFieldElement,
  FormLayoutElement,
  ReportStatus,
  ReportType,
} from "types";
import { ReportContext } from "components/reports/ReportProvider";

export const Form = ({
  id,
  formJson,
  onSubmit,
  onError,
  formData,
  validateOnRender,
  autosave,
  children,
  ...props
}: Props) => {
  const { fields, options } = formJson;

  // determine if fields should be disabled (based on admin roles )
  const { userIsAdmin, userIsReadOnly } = useUser().user ?? {};
  const { report } = useContext(ReportContext);
  const fieldInputDisabled =
    ((userIsAdmin || userIsReadOnly) && formJson.adminDisabled) ||
    (report?.status === ReportStatus.SUBMITTED &&
      report?.reportType === ReportType.MLR);

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

  return (
    <FormProvider {...form}>
      <form
        id={id}
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmit as any, onError || onErrorHandler)}
        {...props}
      >
        <Box sx={sx}>{renderFormFields(fields)}</Box>
        {children}
      </form>
    </FormProvider>
  );
};

interface Props {
  id: string;
  formJson: FormJson;
  onSubmit: Function;
  onError?: SubmitErrorHandler<FieldValues>;
  formData?: AnyObject;
  autosave?: boolean;
  validateOnRender?: boolean;
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
    color: "palette.gray",
  },
  // field hint
  ".ds-c-field__hint": {
    marginBottom: "0.25rem",
  },
  // field hint and error message
  ".ds-c-field__hint, .ds-c-field__error-message ": {
    fontSize: "sm",
    ul: {
      paddingLeft: "2rem",
    },
    ol: {
      margin: "0.25rem 0.5rem",
      padding: "0.5rem",
    },
    a: {
      color: "palette.primary",
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
};
