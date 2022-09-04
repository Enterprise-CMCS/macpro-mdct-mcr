// components
import { Box } from "@chakra-ui/react";
import { Form, ReportPageFooter } from "components";
// utils
import { findRoute } from "utils";
import { FormJson } from "types";
// form data
import { mcparRoutesFlatArray as mcparRoutes } from "forms/mcpar";
import { reportSchema } from "forms/mcpar/reportSchema";

export const StandardFormSection = ({ path, form, onSubmit }: Props) => {
  // make routes
  const previousRoute = findRoute(mcparRoutes, path, "previous", "/mcpar");
  const nextRoute = findRoute(mcparRoutes, path, "next", "/mcpar");

  return (
    <Box data-testid="standard-form-section">
      {form && (
        <>
          <Form id={form.id} formJson={form} onSubmit={onSubmit} />
          <ReportPageFooter
            formId={form.id}
            previousRoute={previousRoute}
            nextRoute={nextRoute}
          />
        </>
      )}
    </Box>
  );
};

interface Props {
  path: string;
  form?: FormJson;
  onSubmit: Function;
}
