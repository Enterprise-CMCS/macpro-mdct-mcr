import { useContext, useState } from "react";
import { useNavigate } from "react-router";
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
import {
  filterFormData,
  formModifications,
  parseCustomHtml,
  useFindRoute,
  useStore,
} from "utils";

export const StandardReportPage = ({ route, validateOnRender }: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { updateReport } = useContext(ReportContext);
  // state management
  const { full_name, state } = useStore().user ?? {};
  const { report } = useStore();

  const navigate = useNavigate();
  const { nextRoute } = useFindRoute(
    report!.formTemplate.flatRoutes!,
    report!.formTemplate.basePath
  );

  const isNewPlanExemption =
    route.path ===
    "/mcpar/plan-level-indicators/quality-measures/new-plan-exemption";

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

  const { accordion, formJson, showError } = formModifications(
    report?.reportType,
    route,
    report?.fieldData
  );

  return (
    <Box>
      {route.verbiage.intro && (
        <ReportPageIntro
          accordion={accordion}
          text={route.verbiage.intro}
          reportType={report?.reportType}
        />
      )}
      {isNewPlanExemption && showError ? (
        <Box sx={sx.missingEntity}>
          {parseCustomHtml(route.verbiage.missingEntityMessage || "")}
        </Box>
      ) : (
        <Form
          id={route.form.id}
          formJson={formJson}
          onSubmit={onSubmit}
          onError={onError}
          formData={report?.fieldData}
          autosave
          validateOnRender={validateOnRender || false}
          dontReset={false}
        />
      )}
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

const sx = {
  missingEntity: {
    fontWeight: "bold",
    marginBottom: "spacer4",
    a: {
      color: "primary",
      textDecoration: "underline",
      "&:hover": {
        color: "primary_darker",
      },
    },
  },
  missingEntityMessage: {
    paddingTop: "spacer2",
    fontWeight: "bold",
    a: {
      color: "primary",
      textDecoration: "underline",
      "&:hover": {
        color: "primary_darker",
      },
    },
    ol: {
      paddingLeft: "spacer2",
    },
  },
};
