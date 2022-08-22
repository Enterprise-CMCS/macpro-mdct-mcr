import { useContext } from "react";
// components
import { Box } from "@chakra-ui/react";
import { Form, ReportContext, ReportPageFooter } from "components";
// utils
import { findRoute, hydrateFormFields } from "utils";
import { PageJson } from "types";
// form data
import { mcparRoutes } from "forms/mcpar";
import { reportSchema } from "forms/mcpar/reportSchema";

export const StandardFormSection = ({ pageJson, onSubmit }: Props) => {
  const { reportData } = useContext(ReportContext);
  const { path, form } = pageJson;

  // make routes
  const previousRoute = findRoute(mcparRoutes, path, "previous", "/mcpar");
  const nextRoute = findRoute(mcparRoutes, path, "next", "/mcpar");

  if (reportData) {
    form.fields = hydrateFormFields(form.fields, reportData);
  }

  return (
    <Box data-testid="standard-form-section">
      <Form
        id={form.id}
        formJson={form}
        formSchema={reportSchema[form.id as keyof typeof reportSchema]}
        onSubmit={onSubmit}
      />
      <ReportPageFooter
        formId={form.id}
        previousRoute={previousRoute}
        nextRoute={nextRoute}
      />
    </Box>
  );
};

interface Props {
  pageJson: PageJson;
  onSubmit: Function;
}
