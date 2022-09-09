import { ReactNode, useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { object as yupSchema } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// components
import { Box } from "@chakra-ui/react";
import { ReportContext } from "components";
// utils
import {
  formFieldFactory,
  hydrateFormFields,
  sortFormErrors,
  useUser,
} from "utils";
import { FormJson, FormField, UserRoles } from "types";

export const Form = ({ id, formJson, onSubmit, children, ...props }: Props) => {
  const { fields, options } = formJson;
  const { reportData } = useContext(ReportContext);
  const formSchema = yupSchema(formJson.validation || {});

  // determine if fields should be disabled (based on admin roles )
  const { userRole } = useUser().user ?? {};
  const isAdminUser =
    userRole === UserRoles.ADMIN ||
    userRole === UserRoles.APPROVER ||
    userRole === UserRoles.HELP_DESK;
  const fieldInputDisabled = isAdminUser && formJson.adminDisabled;

  // make form context
  const form = useForm({
    resolver: !fieldInputDisabled ? yupResolver(formSchema) : undefined,
    shouldFocusError: false,
    mode: "onChange",
    ...(options as any),
  });

  // will run if any validation errors exist on form submission
  const onErrorHandler = (errors: any) => {
    // sort errors in order of registration/page display
    const sortedErrors: any[] = sortFormErrors(formSchema.fields, errors);
    // focus the first error on the page and scroll to it
    const fieldToFocus = document.querySelector(
      `[name='${sortedErrors[0]}']`
    )! as HTMLElement;
    fieldToFocus?.scrollIntoView({ behavior: "smooth", block: "center" });
    fieldToFocus?.focus({ preventScroll: true });
  };

  // hydrate and create form fields using formFieldFactory
  const formFieldsToRender = (fields: FormField[]) => {
    const hydratedFields = hydrateFormFields(fields, reportData);
    return formFieldFactory(hydratedFields, fieldInputDisabled!);
  };

  return (
    <FormProvider {...form}>
      <form
        id={id}
        onSubmit={form.handleSubmit(onSubmit as any, onErrorHandler)}
        {...props}
      >
        <Box sx={sx}>{formFieldsToRender(fields)}</Box>
        {children}
      </form>
    </FormProvider>
  );
};

interface Props {
  id: string;
  formJson: FormJson;
  onSubmit: Function;
  children?: ReactNode;
  [key: string]: any;
}

const sx = {
  // default
  ".ds-c-field, .ds-c-label": {
    maxWidth: "32rem",
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
  },
  // nested child fields
  ".ds-c-choice__checkedChild.nested": {
    paddingY: "0.25rem",
    paddingTop: 0,
    ".ds-c-fieldset, label": {
      marginTop: 0,
    },
  },
};
