// components
import { Box } from "@chakra-ui/react";
import { Form } from "components";
// utils
import { FormJson } from "types";

export const StaticPageSection = ({ form, onSubmit }: Props) => (
  <Box data-testid="static-page-section">
    <Form id={form.id} formJson={form} onSubmit={onSubmit} />
  </Box>
);

interface Props {
  form: FormJson;
  onSubmit: Function;
}
