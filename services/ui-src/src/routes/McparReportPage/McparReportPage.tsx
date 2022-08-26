import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Flex } from "@chakra-ui/react";
import {
  ReportContext,
  ReportPage,
  EntityDrawerSection,
  StandardFormSection,
  ReportPageIntro,
  Sidebar,
} from "components";
// utils
import { findRoute, useUser } from "utils";
import { PageJson, ReportStatus, UserRoles } from "types";
// form data
import { mcparRoutes } from "forms/mcpar";

export const McparReportPage = ({ pageJson }: Props) => {
  const navigate = useNavigate();
  const { report, updateReportData, updateReport } = useContext(ReportContext);
  const { path, intro, form } = pageJson;
  const nextRoute = findRoute(mcparRoutes, path, "next", "/mcpar");
  const reportId = report?.reportId;

  // get user's state
  const { user } = useUser();
  const { full_name, state, userRole } = user ?? {};

  const onSubmit = async (formData: any) => {
    if (userRole === UserRoles.STATE_USER || userRole === UserRoles.STATE_REP) {
      const reportDetails = {
        state: state,
        reportId: reportId,
      };
      const reportStatus = {
        status: ReportStatus.IN_PROGRESS,
        lastAlteredBy: full_name,
      };
      updateReportData(reportDetails, formData);
      updateReport(reportDetails, reportStatus);
    }
    navigate(nextRoute);
  };

  const renderPageSection = (pageJson: PageJson) => {
    if (pageJson.drawer) {
      return <EntityDrawerSection pageJson={pageJson} onSubmit={onSubmit} />;
    } else {
      return <StandardFormSection pageJson={pageJson} onSubmit={onSubmit} />;
    }
  };

  useEffect(() => {
    if (!reportId) {
      navigate("/mcpar/dashboard");
    }
  }, [reportId]);

  return (
    <ReportPage data-testid={form.id}>
      <Flex sx={sx.pageContainer}>
        <Sidebar />
        <Flex sx={sx.reportContainer}>
          {intro && <ReportPageIntro text={intro} />}
          {renderPageSection(pageJson)}
        </Flex>
      </Flex>
    </ReportPage>
  );
};

interface Props {
  pageJson: PageJson;
}

const sx = {
  pageContainer: {
    width: "100%",
    height: "100%",
  },
  reportContainer: {
    flexDirection: "column",
    width: "100%",
    maxWidth: "reportPageWidth",
    marginY: "3.5rem",
    marginLeft: "3.5rem",
    h3: {
      paddingBottom: "0.75rem",
      borderBottom: "1.5px solid var(--chakra-colors-palette-gray_lighter)",
      color: "palette.gray_medium",
      fontSize: "lg",
      fontWeight: "bold",
    },
    h4: {
      fontSize: "lg",
      fontWeight: "bold",
    },
  },
};
