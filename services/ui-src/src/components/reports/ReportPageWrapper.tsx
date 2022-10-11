import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Spinner } from "@cmsgov/design-system";
import { Flex } from "@chakra-ui/react";
import {
  ReportContext,
  ModalDrawerReportPage,
  DrawerReportPage,
  PageTemplate,
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
  const { state } = useUser().user ?? {};
  const { report } = useContext(ReportContext);
  const navigate = useNavigate();

  // get state and id from context or storage
  const reportId = report?.id || localStorage.getItem("selectedReport");
  const reportState = state || localStorage.getItem("selectedState");

  useEffect(() => {
    if (!reportId || !reportState) {
      navigate("/mcpar");
    }
  }, [reportId, reportState]);

  const renderPageSection = (route: ReportRouteWithForm) => {
    switch (route.pageType) {
      case PageTypes.DRAWER:
        return <DrawerReportPage route={route as DrawerReportPageShape} />;
      case PageTypes.MODAL_DRAWER:
        return (
          <ModalDrawerReportPage route={route as ModalDrawerReportPageShape} />
        );
      default:
        return <StandardReportPage route={route as StandardReportPageShape} />;
    }
  };

  return (
    <PageTemplate type="report">
      <Flex sx={sx.pageContainer}>
        <Sidebar />
        {!report ? (
          <Flex sx={sx.spinnerContainer}>
            <Spinner size="big" />
          </Flex>
        ) : (
          <Flex id="report-content" sx={sx.reportContainer}>
            {renderPageSection(route)}
          </Flex>
        )}
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
