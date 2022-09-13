import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { object as yupSchema } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// components
import { Box } from "@chakra-ui/react";
// utils

import {
  formFieldFactory,
  hydrateFormFields,
  sortFormErrors,
  useUser,
} from "utils";
import { AnyObject, FormJson, FormField, UserRoles } from "types";

export const Form = ({
  id,
  formJson,
  onSubmit,
  formData = {},
  children,
  ...props
}: Props) => {
  const { fields, options } = formJson;
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
    ...(options as AnyObject),
  });

  // will run if any validation errors exist on form submission
  const onErrorHandler = (errors: AnyObject) => {
    // sort errors in order of registration/page display
    const sortedErrors: string[] = sortFormErrors(formSchema.fields, errors);
    // focus the first error on the page and scroll to it
    const fieldToFocus = document.querySelector(
      `[name='${sortedErrors[0]}']`
    )! as HTMLElement;
    fieldToFocus?.scrollIntoView({ behavior: "smooth", block: "center" });
    fieldToFocus?.focus({ preventScroll: true });
  };

  // hydrate and create form fields using formFieldFactory
  const renderFormFields = (fields: FormField[]) => {
    const fieldsToRender = hydrateFormFields(fields, formData);
    return formFieldFactory(fieldsToRender, fieldInputDisabled || false);
  };

  return (
    <FormProvider {...form}>
      <form
        id={id}
        onSubmit={form.handleSubmit(onSubmit as any, onErrorHandler)}
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
  formData?: AnyObject;
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
