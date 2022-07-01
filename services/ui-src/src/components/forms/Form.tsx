import { ReactNode } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// utils
import { makeFormSchema } from "utils/forms/forms";
// types
import { FormField, FormJson } from "types";

export const Form = ({
  formJson,
  onSubmit,
  onError,
  children,
  ...props
}: Props) => {
  const { fields, options } = formJson;
  const schema = makeFormSchema(fields as FormField[]);

  // make form context
  const form = useForm({
    ...(options as any),
    resolver: yupResolver(schema),
  });

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit as any, onError as any)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
};

interface Props {
  formJson: FormJson;
  onSubmit: Function;
  onError?: Function;
  children: ReactNode;
  [key: string]: any;
}
