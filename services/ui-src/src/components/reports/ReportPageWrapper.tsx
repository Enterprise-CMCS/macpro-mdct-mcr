import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Flex } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
import {
  ReportContext,
  ModalDrawerReportPage,
  DrawerReportPage,
  PageTemplate,
  ReportPageIntro,
  ReportPageFooter,
  Sidebar,
  StandardReportPage,
} from "components";
// utils
import { useUser } from "utils";
import {
  ModalDrawerReportPageShape,
  DrawerReportPageShape,
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
      case PageTypes.DRAWER:
        return (
          <DrawerReportPage
            route={route as DrawerReportPageShape}
            submittingState={{ submitting, setSubmitting }}
          />
        );
      case PageTypes.MODAL_DRAWER:
        return (
          <ModalDrawerReportPage
            route={route as ModalDrawerReportPageShape}
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
          {!report ? (
            <Flex sx={sx.spinnerContainer}>
              <Spinner size="big" />
            </Flex>
          ) : (
            renderPageSection(route)
          )}

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
  spinnerContainer: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    padding: "10",

    ".ds-c-spinner": {
      "&:before": {
        borderColor: "palette.black",
      },
      "&:after": {
        borderLeftColor: "palette.black",
      },
    },
  },
};
