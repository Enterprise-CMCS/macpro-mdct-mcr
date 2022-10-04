import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Flex } from "@chakra-ui/react";
import {
  ReportContext,
  DynamicDrawerReportPage,
  EntityDrawerReportPage,
  PageTemplate,
  ReportPageIntro,
  ReportPageFooter,
  Sidebar,
  StandardReportPage,
} from "components";
// utils
import { useUser } from "utils";
import {
  DynamicDrawerReportPageShape,
  EntityDrawerReportPageShape,
  PageTypes,
  ReportRouteWithForm,
  StandardReportPageShape,
} from "types";

export const ReportPageWrapper = ({ route }: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  // get report, form, and page related-data
  const { report } = useContext(ReportContext);

  const { state } = useUser().user ?? {};

  // get state and id from context or storage
  const reportId = report?.id || localStorage.getItem("selectedReport");
  const reportState = state || localStorage.getItem("selectedState");

  // get next and previous routes
  const navigate = useNavigate();

  useEffect(() => {
    if (!reportId || !reportState) {
      navigate("/mcpar");
    }
  }, [reportId, reportState]);

  const renderPageSection = (route: ReportRouteWithForm) => {
    switch (route.pageType) {
      case PageTypes.ENTITY_DRAWER:
        return (
          <EntityDrawerReportPage
            route={route as EntityDrawerReportPageShape}
            submittingState={{ submitting, setSubmitting }}
          />
        );
      case PageTypes.DYNAMIC_DRAWER:
        return (
          <DynamicDrawerReportPage
            route={route as DynamicDrawerReportPageShape}
            setSubmitting={setSubmitting}
          />
        );
      default:
        return (
          <StandardReportPage
            route={route as StandardReportPageShape}
            setSubmitting={setSubmitting}
          />
        );
    }
  };

  return (
    <PageTemplate type="report">
      <Flex sx={sx.pageContainer}>
        <Sidebar />
        <Flex sx={sx.reportContainer}>
          {route.intro && <ReportPageIntro text={route.intro} />}
          {renderPageSection(route)}
          <ReportPageFooter submitting={submitting} form={route.form} />
        </Flex>
      </Flex>
    </PageTemplate>
  );
};

interface Props {
  route: ReportRouteWithForm;
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
  },
};
