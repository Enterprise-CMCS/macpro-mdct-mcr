import { ReactNode } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// utils
import { formFieldFactory, makeFormSchema } from "utils/forms/forms";
// types
import { FormField, FormJson } from "utils/types/types";

export const Form = ({ id, formJson, onSubmit, children, ...props }: Props) => {
  const { fields, options } = formJson;
  const schema = makeFormSchema(fields as FormField[]);

  // make form context
  const form = useForm({
    resolver: yupResolver(schema),
    shouldFocusError: false,
    ...(options as any),
  });

  const scrollAndFocus = (fieldId: string) => {
    const field = document.querySelector(`[name='${fieldId}']`)! as HTMLElement;

    const fieldTop = field?.getBoundingClientRect().top!;
    const headerHeight = document
      .getElementById("header")
      ?.getBoundingClientRect()!.height!;
    const scrollOffset = 16 * 6; // 6rem

    if (fieldTop <= headerHeight) {
      const scrollLength = fieldTop - headerHeight - scrollOffset;
      window.scrollBy({ top: scrollLength, left: 0, behavior: "smooth" });
    }

    field?.focus({ preventScroll: true });
  };

  const sortErrors = (errors: any) => {
    const orderedFields = Object.keys(form.getValues());
    const sortedErrors: any = [];
    orderedFields.forEach((fieldName: any) => {
      if (errors[fieldName]) {
        sortedErrors.push(fieldName);
      }
    });
    return sortedErrors;
  };

  const onErrorHandler = (errors: any) => {
    const sortedErrors: any[] = sortErrors(errors);
    scrollAndFocus(sortedErrors[0]);
  };

  return (
    <FormProvider {...form}>
      <form
        id={id}
        onSubmit={form.handleSubmit(onSubmit as any, onErrorHandler)}
        {...props}
      >
        {formFieldFactory(fields)}
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
