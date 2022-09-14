import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  TemplateContext,
} from "components";
// utils
import { findRoutes, useUser } from "utils";
import {
  AnyObject,
  FormJson,
  PageJson,
  ReportDataShape,
  ReportStatus,
  UserRoles,
} from "types";

export const ReportPage = () => {
  // get report, form, and page related-data
  const { updateReportData, updateReport } = useContext(ReportContext);
  const { routesLoaded, formTemplate, formRoutes } =
    useContext(TemplateContext);
  const [formView, setFormView] = useState<FormJson | undefined>(undefined);
  const [page, setPage] = useState<AnyObject>({});
  const { state, reportId } = useParams();
  const { pathname } = useLocation();

  useEffect(() => {
    if (routesLoaded) {
      const matchingRoute = formRoutes.filter((route: any) =>
        pathname.includes(route.path)
      );
      if (matchingRoute[0]) {
        setFormView(matchingRoute.form);
        setPage(matchingRoute.page);
      } else {
        navigate(formTemplate.basePath);
      }
    }
  }, [pathname, routesLoaded]);

  // get user state, name, role
  const { user } = useUser();
  const { full_name, userRole } = user ?? {};

  // determine if fields should be disabled (based on admin roles )
  const isAdminUser =
    userRole === UserRoles.ADMIN ||
    userRole === UserRoles.APPROVER ||
    userRole === UserRoles.HELP_DESK;
  const fieldInputDisabled = isAdminUser && formView?.adminDisabled;

  // get next route
  const navigate = useNavigate();

  useEffect(() => {
    if (!reportId || !state) {
      navigate(formTemplate.basePath);
    }
  }, [reportId, state]);

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
      const { nextRoute } = findRoutes(
        pathname,
        formRoutes,
        formTemplate.basePath
      );
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
    <PageTemplate type="report" data-testid={formView?.id}>
      <Flex sx={sx.pageContainer}>
        <Sidebar />
        <Flex sx={sx.reportContainer}>
          {page?.intro && <ReportPageIntro text={page.intro} />}
          {formView && (
            <>
              {renderPageSection(formView, page)}
              <ReportPageFooter
                formId={formView.id}
                shouldDisableAllFields={fieldInputDisabled}
              />
            </>
          )}
        </Flex>
      </Flex>
    </PageTemplate>
  );
};

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
