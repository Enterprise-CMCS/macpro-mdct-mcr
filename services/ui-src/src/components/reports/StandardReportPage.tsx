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
import { filterFormData, useFindRoute, useUser } from "utils";
import { AnyObject, StandardReportPageShape, ReportStatus } from "types";
import { mcparReportRoutesFlat } from "forms/mcpar";

export const StandardReportPage = ({ route }: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { report, updateReport } = useContext(ReportContext);
  const { full_name, state, userIsStateUser, userIsStateRep } =
    useUser().user ?? {};
  const navigate = useNavigate();
  const { nextRoute } = useFindRoute(mcparReportRoutesFlat, "/mcpar");

  const onSubmit = async (enteredData: AnyObject) => {
    if (userIsStateUser || userIsStateRep) {
      setSubmitting(true);
      const reportKeys = {
        state: state,
        id: report?.id,
      };
      const filteredFormData = filterFormData(enteredData, route.form.fields);
      const dataToWrite = {
        status: ReportStatus.IN_PROGRESS,
        lastAlteredBy: full_name,
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
        onSubmit={onSubmit}
        formData={report?.fieldData}
      />
      <ReportPageFooter submitting={submitting} form={route.form} />
    </Box>
  );
};

interface Props {
  route: StandardReportPageShape;
}
