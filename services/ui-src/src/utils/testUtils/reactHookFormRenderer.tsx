import { render } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";

interface WrapperProps {
  children: JSX.Element; // eslint-disable-line no-undef
}

interface AdditionalOptions {
  defaultValues?: Object;
}

export const renderWithHookForm = (
  ui: any,
  { defaultValues = {} }: AdditionalOptions = {}
) => {
  const Wrapper = ({ children }: WrapperProps) => {
    const methods = useForm({ defaultValues });

    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  return {
    ...render(ui, { wrapper: Wrapper }),
  };
};
