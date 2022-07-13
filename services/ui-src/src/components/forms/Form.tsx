import { ReactNode } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// components
import { Box } from "@chakra-ui/react";
// utils
import {
  focusElement,
  formFieldFactory,
  makeFormSchema,
  sortFormErrors,
} from "utils";
// types
import { FormField, FormJson } from "types";

export const Form = ({ id, formJson, onSubmit, children, ...props }: Props) => {
  const { fields, options } = formJson;
  const schema = makeFormSchema(fields as FormField[]);

  // make form context
  const form = useForm({
    resolver: yupResolver(schema),
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
};
