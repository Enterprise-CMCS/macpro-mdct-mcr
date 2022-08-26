// components
import { Box } from "@chakra-ui/react";
import { Form, ReportPageFooter } from "components";
// utils
import { findRoute } from "utils";
import { PageJson } from "types";
// form data
import { mcparRoutes } from "forms/mcpar";
import { reportSchema } from "forms/mcpar/reportSchema";

export const StandardFormSection = ({ pageJson, onSubmit }: Props) => {
  const { path, form } = pageJson;

  // make routes
  const previousRoute = findRoute(mcparRoutes, path, "previous", "/mcpar");
  const nextRoute = findRoute(mcparRoutes, path, "next", "/mcpar");

  return (
    <Box data-testid="standard-form-section">
      Identical blocks of code found in 2 locations. Consider refactoring. …
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
