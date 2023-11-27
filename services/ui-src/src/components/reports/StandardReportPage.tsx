import { useContext, useState } from "react";
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
import { filterFormData, useFindRoute, useStore } from "utils";
import {
  AnyObject,
  isFieldElement,
  ReportStatus,
  StandardReportPageShape,
} from "types";

export const StandardReportPage = ({ route, validateOnRender }: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { report, updateReport } = useContext(ReportContext);
  const { full_name, state } = useStore().user ?? {};
  const navigate = useNavigate();
  const { nextRoute } = useFindRoute(
    report!.formTemplate.flatRoutes!,
    report!.formTemplate.basePath
  );

  const onError = () => {
    navigate(nextRoute);
  };

  const onSubmit = async (enteredData: AnyObject) => {
    setSubmitting(true);
    const reportKeys = {
      reportType: report?.reportType,
      state: state,
      id: report?.id,
    };
    const filteredFormData = filterFormData(
      enteredData,
      route.form.fields.filter(isFieldElement)
    );
    const dataToWrite = {
      metadata: {
        status: ReportStatus.IN_PROGRESS,
        lastAlteredBy: full_name,
      },
      fieldData: filteredFormData,
    };
    await updateReport(reportKeys, dataToWrite);
    setSubmitting(false);

    navigate(nextRoute);
  };

  return (
    <Box>
      {route.verbiage.intro && (
        <ReportPageIntro
          text={route.verbiage.intro}
          reportType={report?.reportType}
        />
      )}
      <Form
        id={route.form.id}
        formJson={route.form}
        onSubmit={onSubmit}
        onError={onError}
        formData={report?.fieldData}
        autosave
        validateOnRender={validateOnRender || false}
        dontReset={false}
      />
      <ReportPageFooter
        submitting={submitting}
        form={route.form}
        praDisclosure={route.verbiage.praDisclosure}
      />
    </Box>
  );
};

interface Props {
  route: StandardReportPageShape;
  validateOnRender?: boolean;
}
