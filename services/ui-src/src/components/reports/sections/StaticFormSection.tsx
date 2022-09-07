// components
import { Box } from "@chakra-ui/react";
import { Form } from "components";
// utils
import { FormJson } from "types";

export const StaticFormSection = ({ form, onSubmit }: Props) => (
  <Box data-testid="static-form-section">
    <Form id={form.id} formJson={form} onSubmit={onSubmit} />
  </Box>
);

interface Props {
  form: FormJson;
  onSubmit: Function;
}
