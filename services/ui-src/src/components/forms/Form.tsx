import { ReactNode } from "react";
import { FormProvider } from "react-hook-form";
import { InputChangeEvent } from "../../utils/types/types";

export const Form = ({
  form,
  onInputChangeCallback,
  onSubmitCallback,
  children,
}: Props) => {
  const onInputChange = (e: InputChangeEvent) => {
    const { id, value }: any = e.target;
    form.setValue(id, value);
    onInputChangeCallback?.(id, value);
  };

  const onSubmit = async () => {
    await onSubmitCallback?.();
  };

  return (
    <FormProvider {...{ ...form, onInputChange: onInputChange }}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};

interface Props {
  form: any;
  onInputChangeCallback?: any;
  onSubmitCallback?: Function;
  children: ReactNode;
  [key: string]: any;
}
