import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Flex } from "@chakra-ui/react";
import {
  ReportContext,
  EntityDrawerSection,
  PageTemplate,
  ReportPageIntro,
  ReportPageFooter,
  Sidebar,
  StandardFormSection,
} from "components";
// utils
import { useFindRoute, useUser } from "utils";
import {
  FormJson,
  PageJson,
  ReportJson,
  ReportRoute,
  ReportStatus,
  UserRoles,
} from "types";

export const McparReportPage = ({ reportJson, route }: Props) => {
  // get report, form, and page related-data
  const { report, updateReportData, updateReport } = useContext(ReportContext);
  const reportId = report?.reportId;
  const { basePath, routes } = reportJson;
  const { form, page } = route;

  // get user state, name, role
  const { user } = useUser();
  const { full_name, state, userRole } = user ?? {};

  // get next and previous routes
  const navigate = useNavigate();
  const { previousRoute, nextRoute } = useFindRoute(routes, basePath);

  useEffect(() => {
    if (!reportId) {
      navigate(basePath);
    }
  }, [reportId]);

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

  const renderPageSection = (form: FormJson, page?: PageJson) => {
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
    <PageTemplate type="report" data-testid={form.id}>
      <Flex sx={sx.pageContainer}>
        <Sidebar />
        <Flex sx={sx.reportContainer}>
          {page?.intro && <ReportPageIntro text={page.intro} />}
          {renderPageSection(form, page)}
          <ReportPageFooter
            formId={form.id}
            previousRoute={previousRoute}
            nextRoute={nextRoute}
          />
        </Flex>
      </Flex>
    </PageTemplate>
  );
};

interface Props {
  reportJson: ReportJson;
  route: ReportRoute;
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
