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

  const onSubmit = async (enteredData: AnyObject) => {
    if (userIsStateUser || userIsStateRep) {
      setSubmitting(true);
      const reportKeys = {
        reportType: report?.reportType,
        state: state,
        id: report?.id,
      };
      const filteredFormData = filterFormData(enteredData, route.form.fields);
      const dataToWrite = {
        metadata: {
          status: ReportStatus.IN_PROGRESS,
          lastAlteredBy: full_name,
        },
        fieldData: filteredFormData,
      };
      await updateReport(reportKeys, dataToWrite);
      setSubmitting(false);
    }
    navigate(nextRoute);
  };

  return (
    <Box data-testid="standard-page">
      {route.verbiage.intro && <ReportPageIntro text={route.verbiage.intro} />}
      <Form
        id={route.form.id}
        formJson={route.form}
        onSubmit={() => navigate(nextRoute)}
        formData={report?.fieldData}
        autosave
      />
      <ReportPageFooter form={route.form} />
    </Box>
  );
};

interface Props {
  route: StandardReportPageShape;
}
