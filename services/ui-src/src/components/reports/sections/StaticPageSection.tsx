import { useContext } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Box } from "@chakra-ui/react";
import { Form, ReportContext } from "components";
// utils
import { useFindRoute, useUser } from "utils";
import { FormJson, ReportDataShape, ReportStatus, UserRoles } from "types";
import { mcparReportRoutesFlat } from "forms/mcpar";

export const StaticPageSection = ({ form }: Props) => {
  const { report, reportData, updateReportData, updateReport } =
    useContext(ReportContext);

  // get user state, name, role
  const { user } = useUser();
  const { full_name, state, userRole } = user ?? {};

  // get state and reportId from context or storage
  const reportId = report?.reportId || localStorage.getItem("selectedReport");
  const reportState = state || localStorage.getItem("selectedState");

  // get next and previous routes
  const navigate = useNavigate();
  const { nextRoute } = useFindRoute(mcparReportRoutesFlat, "/mcpar");

  const onSubmit = async (formData: ReportDataShape) => {
    if (userRole === UserRoles.STATE_USER || userRole === UserRoles.STATE_REP) {
      const reportKeys = {
        state: reportState,
        reportId: reportId,
      };
      const reportMetadata = {
        status: ReportStatus.IN_PROGRESS,
        lastAlteredBy: full_name,
      };
      await updateReportData(reportKeys, formData);
      await updateReport(reportKeys, reportMetadata);
    }
    navigate(nextRoute);
  };

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
}
