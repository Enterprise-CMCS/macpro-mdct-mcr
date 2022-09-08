import { ReactNode, useContext, useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { object as yupSchema } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// components
import { Box } from "@chakra-ui/react";
import { ReportContext } from "components";
// utils
import { formFieldFactory, hydrateFormFields, sortFormErrors } from "utils";
import { FormJson, FormField } from "types";

export const Form = ({ id, formJson, onSubmit, children, ...props }: Props) => {
  const { fields, options } = formJson;
  const [theFields, setTheFields] = useState(fields);
  const { reportData } = useContext(ReportContext);

  useEffect(() => {
    setTheFields(fields);
  }, [reportData]);

  const formSchema = yupSchema(formJson.validation || {});

  // make form context
  const form = useForm({
    resolver: yupResolver(formSchema),
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
    return formFieldFactory(hydratedFields);
  };

  return (
    <FormProvider {...form}>
      <form
        id={id}
        onSubmit={form.handleSubmit(onSubmit as any, onErrorHandler)}
        {...props}
      >
        <Box sx={sx}>{formFieldsToRender(theFields)}</Box>
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
