import { useContext } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Box } from "@chakra-ui/react";
import { Form, ReportContext } from "components";
// utils
import { useFindRoute, useUser } from "utils";
import { AnyObject, FormJson, ReportStatus } from "types";
import { mcparReportRoutesFlat } from "forms/mcpar";

export const StaticPageSection = ({ form, setLoading }: Props) => {
  const { report, updateReport } = useContext(ReportContext);
  const { full_name, state, userIsStateUser, userIsStateRep } =
    useUser().user ?? {};
  const navigate = useNavigate();
  const { nextRoute } = useFindRoute(mcparReportRoutesFlat, "/mcpar");

  const onSubmit = async (formData: AnyObject) => {
    if (userIsStateUser || userIsStateRep) {
      setLoading(true);
      const reportKeys = {
        state: state,
        id: report?.id,
      };
      const dataToWrite = {
        status: ReportStatus.IN_PROGRESS,
        lastAlteredBy: full_name,
        fieldData: formData,
      };
      await updateReport(reportKeys, dataToWrite);
      setLoading(false);
    }
    navigate(nextRoute);
  };

  return (
    <Box data-testid="static-page-section">
      <Form
        id={form.id}
        formJson={form}
        onSubmit={onSubmit}
        formData={report}
      />
    </Box>
  );
};

interface Props {
  form: FormJson;
  setLoading: Function;
}
