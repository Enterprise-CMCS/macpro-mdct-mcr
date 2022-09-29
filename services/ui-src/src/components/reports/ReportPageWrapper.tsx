import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Flex } from "@chakra-ui/react";
import {
  ReportContext,
  DynamicDrawerReportPage,
  StaticDrawerSection,
  PageTemplate,
  ReportPageIntro,
  ReportPageFooter,
  Sidebar,
  StaticPageSection,
} from "components";
// utils
import { useUser } from "utils";
import { FormJson, PageJson, PageTypes, ReportRoute } from "types";

export const ReportPageWrapper = ({ route }: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  // get report, form, and page related-data
  const { report } = useContext(ReportContext);
  const { form, page } = route;

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

  const renderPageSection = (form: FormJson, page?: PageJson) => {
    switch (page?.pageType) {
      case PageTypes.STATIC_DRAWER:
        return (
          <StaticDrawerSection
            form={form}
            page={page}
            submittingState={{ submitting, setSubmitting }}
          />
        );
      case PageTypes.DYNAMIC_DRAWER:
        return (
          <DynamicDrawerReportPage
            form={form}
            dynamicTable={page.dynamicTable}
            setSubmitting={setSubmitting}
          />
        );
      default:
        return <StaticPageSection form={form} setSubmitting={setSubmitting} />;
    }
  };

  return (
    <PageTemplate type="report" data-testid={form.id}>
      <Flex sx={sx.pageContainer}>
        <Sidebar />
        <Flex sx={sx.reportContainer}>
          {page?.intro && <ReportPageIntro text={page.intro} />}
          {renderPageSection(form, page)}
          <ReportPageFooter submitting={submitting} form={form} />
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
