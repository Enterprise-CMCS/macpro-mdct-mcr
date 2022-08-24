import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// components
import { Box } from "@chakra-ui/react";
// utils
import { focusElement, formFieldFactory, sortFormErrors } from "utils";
import { FormJson } from "types";

export const Form = ({
  id,
  formJson,
  formSchema,
  onSubmit,
  children,
  ...props
}: Props) => {
  const { fields, options } = formJson;

  // make form context
  const form = useForm({
    resolver: yupResolver(formSchema),
    shouldFocusError: false,
    ...(options as any),
  });

  const onErrorHandler = (errors: any) => {
    const sortedErrors: any[] = sortFormErrors(form, errors);
    const fieldToFocus = document.querySelector(
      `[name='${sortedErrors[0]}']`
    )! as HTMLElement;
    focusElement(fieldToFocus);
  };

  return (
    <FormProvider {...form}>
      <form
        id={id}
        onSubmit={form.handleSubmit(onSubmit as any, onErrorHandler)}
        {...props}
      >
        <Box sx={sx}>{formFieldFactory(fields)}</Box>
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
  },
};
