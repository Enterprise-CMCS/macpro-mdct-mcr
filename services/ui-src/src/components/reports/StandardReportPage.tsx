import { useContext } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Box } from "@chakra-ui/react";
import {
  Form,
  ReportContext,
  ReportPageFooter,
  ReportPageIntro,
} from "components";
// utils
import { useFindRoute } from "utils";
import { StandardReportPageShape } from "types";

export const StandardReportPage = ({ route }: Props) => {
  const { report } = useContext(ReportContext);
  const navigate = useNavigate();
  const { nextRoute } = useFindRoute(
    report!.formTemplate.flatRoutes!,
    report!.formTemplate.basePath
  );

  return (
    <Box data-testid="standard-page">
      {route.verbiage.intro && <ReportPageIntro text={route.verbiage.intro} />}
      <Form
        id={route.form.id}
        formJson={route.form}
        onSubmit={() => navigate(nextRoute)}
        formData={report?.fieldData}
      />
      <ReportPageFooter form={route.form} />
    </Box>
  );
};

interface Props {
  route: StandardReportPageShape;
}
