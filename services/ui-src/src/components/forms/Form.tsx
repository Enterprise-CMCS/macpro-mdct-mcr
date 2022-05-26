import { ReactNode } from "react";
import { FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputChangeEvent } from "../../utils/types/types";

export const Form = ({
  form,
  formSchema,
  mode,
  onInputChangeCallback,
  onSubmitCallback,
  children,
}: Props) => {
  const onInputChange = (e: InputChangeEvent) => {
    const { id, value }: any = e.target;
    form.setValue(id, value);
    onInputChangeCallback?.(id, value);
  };

  form.resolver = yupResolver(formSchema);
  form.mode = mode;

  const onSubmit = () => {
    onSubmitCallback?.();
  };

  return (
    <FormProvider {...{ ...form, onInputChange: onInputChange }}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};

interface Props {
  form: any;
  formSchema: any;
  mode: string;
  onInputChangeCallback?: any;
  onSubmitCallback?: any;
  children: ReactNode;
  [key: string]: any;
}
