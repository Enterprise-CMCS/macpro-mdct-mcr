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
import { FormJson, PageJson, ReportStatus, UserRoles } from "types";
// form data
import { mcparRoutesFlatArray as mcparRoutes } from "forms/mcpar";

export const McparReportPage = ({ path, page, form }: Props) => {
  const navigate = useNavigate();
  const { report, updateReportData, updateReport } = useContext(ReportContext);
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
      await updateReportData(reportDetails, formData);
      await updateReport(reportDetails, reportStatus);
    }
    navigate(nextRoute);
  };

  const renderPageSection = (page: PageJson) => {
    if (page.drawer) {
      return (
        <EntityDrawerSection
          path={path}
          form={form}
          drawer={page.drawer}
          onSubmit={onSubmit}
        />
      );
    } else {
      return (
        <StandardFormSection path={path} form={form} onSubmit={onSubmit} />
      );
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
          {page.intro && <ReportPageIntro text={page.intro} />}
          {renderPageSection(page)}
        </Flex>
      </Flex>
    </ReportPage>
  );
};

interface Props {
  path: string;
  page: PageJson;
  form: FormJson;
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
      fontSize: "lg",
      fontWeight: "bold",
    },
    h4: {
      paddingBottom: "0.75rem",
      borderBottom: "1.5px solid var(--chakra-colors-palette-gray_lighter)",
      color: "palette.gray_medium",
      fontSize: "lg",
      fontWeight: "bold",
    },
    h5: {
      fontSize: "lg",
      fontWeight: "bold",
    },
  },
};
