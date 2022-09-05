import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
// components
import { Flex } from "@chakra-ui/react";
import {
  ReportContext,
  ReportPage,
  EntityDrawerSection,
  StandardFormSection,
  ReportPageIntro,
  ReportPageFooter,
  Sidebar,
} from "components";
// utils
import { findRoute, useUser } from "utils";
import {
  FormJson,
  PageJson,
  ReportRoute,
  ReportStatus,
  UserRoles,
} from "types";

export const McparReportPage = ({ reportRouteArray, page, form }: Props) => {
  const { report, updateReportData, updateReport } = useContext(ReportContext);
  const reportId = report?.reportId;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const nextRoute = findRoute(reportRouteArray, pathname, "next", "/mcpar");
  const previousRoute = findRoute(
    reportRouteArray,
    pathname,
    "previous",
    "/mcpar"
  );

  useEffect(() => {
    if (!reportId) {
      navigate("/mcpar/dashboard");
    }
  }, [reportId]);

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
    if (!page?.drawer) {
      navigate(nextRoute);
    }
  };

  const renderPageSection = (page?: PageJson, form?: FormJson) => {
    if (page?.drawer) {
      return (
        <EntityDrawerSection
          form={form}
          drawer={page.drawer}
          onSubmit={onSubmit}
        />
      );
    } else {
      return <StandardFormSection form={form} onSubmit={onSubmit} />;
    }
  };

  return (
    <ReportPage data-testid={form?.id}>
      <Flex sx={sx.pageContainer}>
        <Sidebar />
        <Flex sx={sx.reportContainer}>
          {page?.intro && <ReportPageIntro text={page.intro} />}
          {renderPageSection(page, form)}
          <ReportPageFooter
            formId={form?.id}
            previousRoute={previousRoute}
            nextRoute={nextRoute}
          />
        </Flex>
      </Flex>
    </ReportPage>
  );
};

interface Props {
  reportRouteArray: ReportRoute[];
  page?: PageJson;
  form?: FormJson;
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
