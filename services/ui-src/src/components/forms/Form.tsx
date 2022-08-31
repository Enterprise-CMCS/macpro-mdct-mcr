import { ReactNode, useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// components
import { Box } from "@chakra-ui/react";
import { ReportContext } from "components";
// utils
import { formFieldFactory, hydrateFormFields, sortFormErrors } from "utils";
import { FormJson, FormField } from "types";

export const Form = ({
  id,
  formJson,
  formSchema,
  onSubmit,
  children,
  ...props
}: Props) => {
  const { fields, options } = formJson;
  const { reportData } = useContext(ReportContext);

  // make form context
  const form = useForm({
    resolver: yupResolver(formSchema),
    shouldFocusError: false,
    ...(options as any),
  });

  const onErrorHandler = (errors: any) => {
    const sortedErrors: any[] = sortFormErrors(formSchema.fields, errors);
    const fieldToFocus = document.querySelector(
      `[name='${sortedErrors[0]}']`
    )! as HTMLElement;
    fieldToFocus?.scrollIntoView({ behavior: "smooth", block: "center" });
    fieldToFocus?.focus({ preventScroll: true });
  };

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
        <Box sx={sx}>{formFieldsToRender(fields)}</Box>
        {children}
      </form>
    </FormProvider>
  );
};

interface Props {
  id: string;
  formJson: FormJson;
  formSchema: any;
  onSubmit: Function;
  children?: ReactNode;
  [key: string]: any;
}

const sx = {
  ".ds-c-field, .ds-c-label": {
    maxWidth: "32rem",
  },
  ".ds-c-field[disabled]": {
    color: "palette.gray",
  },
  ".ds-c-field__hint, .ds-c-field__error-message ": {
    fontSize: "sm",
    ul: {
      paddingLeft: "2rem",
    },
  },
};
