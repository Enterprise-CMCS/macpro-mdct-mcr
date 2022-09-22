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
  StaticPageSection,
} from "components";
// utils
import { useFindRoute, useUser } from "utils";
import {
  AnyObject,
  FormJson,
  PageJson,
  PageTypes,
  ReportRoute,
  ReportStatus,
} from "types";
import { mcparReportRoutesFlat } from "forms/mcpar";

export const ReportPage = ({ route }: Props) => {
  // get report, form, and page related-data
  const { report, updateReport } = useContext(ReportContext);
  const { form, page } = route;

  const { full_name, state, userIsStateUser, userIsStateRep } =
    useUser().user ?? {};

  // get state and id from context or storage
  const reportId = report?.id || localStorage.getItem("selectedReport");
  const reportState = state || localStorage.getItem("selectedState");

  // get next and previous routes
  const navigate = useNavigate();
  const { previousRoute, nextRoute } = useFindRoute(
    mcparReportRoutesFlat,
    "/mcpar"
  );

  useEffect(() => {
    if (!reportId || !reportState) {
      navigate("/mcpar");
    }
  }, [reportId, reportState]);

  const onSubmit = async (formData: AnyObject) => {
    if (userIsStateUser || userIsStateRep) {
      const reportKeys = {
        state: state,
        id: reportId,
      };
      const dataToWrite = {
        status: ReportStatus.IN_PROGRESS,
        lastAlteredBy: full_name,
        fieldData: formData,
      };
      await updateReport(reportKeys, dataToWrite);
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
            form={form}
            previousRoute={previousRoute}
            nextRoute={nextRoute}
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
