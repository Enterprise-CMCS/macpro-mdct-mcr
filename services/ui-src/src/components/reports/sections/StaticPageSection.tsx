// components
import { Box } from "@chakra-ui/react";
import { Form, ReportContext } from "components";
import { useContext } from "react";
// utils
import { FormJson } from "types";

export const StaticPageSection = ({ form, onSubmit }: Props) => {
  const { reportData } = useContext(ReportContext);
  return (
    <Box data-testid="static-page-section">
      <Form
        id={form.id}
        formJson={form}
        onSubmit={onSubmit}
        formData={reportData}
      />
    </Box>
  );
};

interface Props {
  form: FormJson;
  onSubmit: Function;
}
