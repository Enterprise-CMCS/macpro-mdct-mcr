import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Flex } from "@chakra-ui/react";
import {
  ReportContext,
  DynamicDrawerSection,
  StaticDrawerSection,
  PageTemplate,
  ReportPageIntro,
  ReportPageFooter,
  Sidebar,
  TemplateContext,
  StaticPageSection,
} from "components";
// utils
import { useFindRoute, useUser } from "utils";
import {
  FormJson,
  PageJson,
  PageTypes,
  ReportDataShape,
  ReportRoute,
  ReportStatus,
  UserRoles,
} from "types";

export const ReportPage = ({ route }: Props) => {
  // get report, form, and page related-data
  const { report, updateReportData, updateReport } = useContext(ReportContext);
  const { formTemplate, formRoutes } = useContext(TemplateContext);
  const { form, page } = route;

  // get user state, name, role
  const { user } = useUser();
  const { full_name, state, userRole } = user ?? {};

  // determine if fields should be disabled (based on admin roles )
  const isAdminUser =
    userRole === UserRoles.ADMIN ||
    userRole === UserRoles.APPROVER ||
    userRole === UserRoles.HELP_DESK;
  const fieldInputDisabled = isAdminUser && form.adminDisabled;

  // get state and reportId from context or storage
  const reportId = report?.reportId || localStorage.getItem("selectedReport");
  const reportState = state || localStorage.getItem("selectedState");

  // get next route
  const navigate = useNavigate();
  const { nextRoute } = useFindRoute(formRoutes, formTemplate.basePath);

  useEffect(() => {
    if (!reportId || !reportState) {
      navigate(formTemplate.basePath);
    }
  }, [reportId, reportState]);

  const onSubmit = async (formData: ReportDataShape) => {
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
    switch (page?.pageType) {
      case PageTypes.STATIC_PAGE:
        return <StaticPageSection form={form} onSubmit={onSubmit} />;
      case PageTypes.STATIC_DRAWER:
        return (
          <StaticDrawerSection
            form={form}
            drawer={page.drawer!}
            onSubmit={onSubmit}
          />
        );
      case PageTypes.DYNAMIC_DRAWER:
        return (
          <DynamicDrawerSection
            form={form}
            dynamicTable={page.dynamicTable}
            onSubmit={onSubmit}
          />
        );
      default:
        return <StaticPageSection form={form} onSubmit={onSubmit} />;
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
            shouldDisableAllFields={fieldInputDisabled}
          />
        </Flex>
      </Flex>
    </PageTemplate>
  );
};

interface Props {
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
