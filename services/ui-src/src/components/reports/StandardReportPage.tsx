import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router";
// components
import { Box } from "@chakra-ui/react";
import {
  Form,
  ReportContext,
  ReportPageFooter,
  ReportPageIntro,
} from "components";
// types
import {
  AnyObject,
  isFieldElement,
  ReportStatus,
  StandardReportPageShape,
} from "types";
// utils
import { filterFormData, useFindRoute, useStore } from "utils";

export const StandardReportPage = ({ route, validateOnRender }: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { updateReport } = useContext(ReportContext);
  // state management
  const { full_name } = useStore().user ?? {};
  const { report } = useStore();
  const { reportType, reportId, state } = useParams();

  const navigate = useNavigate();
  const { nextRoute } = useFindRoute(
    report!.formTemplate.flatRoutes!,
    report!.formTemplate.basePath
  );

  const basePath = `/report/${reportType}/${state}/${reportId}`;
  const formattedNext = `${basePath}/${nextRoute}`;

  const onError = () => {
    navigate(formattedNext);
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

    navigate(formattedNext);
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
