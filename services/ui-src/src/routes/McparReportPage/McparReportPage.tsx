import { useContext } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import {
  Error,
  Form,
  Icon,
  ReportContext,
  ReportPage,
  Sidebar,
} from "components";
// utils
import { findRoute, hydrateFormFields, parseCustomHtml, useUser } from "utils";
import { AnyObject, CustomHtmlElement, UserRoles } from "types";
// form data
import { mcparRoutes } from "forms/mcpar";
import { reportSchema } from "forms/mcpar/reportSchema";

export const McparReportPage = ({ pageJson }: Props) => {
  const navigate = useNavigate();
  const {
    reportData,
    updateReportData,
    updateReportStatus,
    errorMessage: error,
  } = useContext(ReportContext);
  const { path, intro, form } = pageJson;

  // make routes
  const previousRoute = findRoute(mcparRoutes, path, "previous", "/mcpar");
  const nextRoute = findRoute(mcparRoutes, path, "next", "/mcpar");

  // get user's state
  const { user } = useUser();
  const { state, userRole } = user ?? {};
  const reportYear = "2022";
  const reportKey = `${state}${reportYear}`;

  // TODO: get real program name per report
  const programName = "tempName";

  const onSubmit = async (formData: any) => {
    if (userRole === UserRoles.STATE_USER || userRole === UserRoles.STATE_REP) {
      const report = {
        key: reportKey,
        programName: programName,
        report: formData,
      };
      const reportStatus = {
        key: reportKey,
        programName: programName,
        status: "In Progress",
      };
      updateReportData(report);
      updateReportStatus(reportStatus);
    }
    navigate(nextRoute);
  };

  if (reportData?.report) {
    form.fields = hydrateFormFields(form.fields, reportData.report);
  }

  return (
    <ReportPage data-testid={form.id}>
      <Flex sx={sx.pageContainer}>
        <Sidebar />
        {error ? (
          <Error />
        ) : (
          <Flex sx={sx.reportContainer}>
            <ReportPageIntro text={intro} />
            <Form
              id={form.id}
              formJson={form}
              formSchema={reportSchema[form.id as keyof typeof reportSchema]}
              onSubmit={onSubmit}
            />
            <ReportPageFooter formId={form.id} previousRoute={previousRoute} />
          </Flex>
        )}
      </Flex>
    </ReportPage>
  );
};

interface Props {
  pageJson: AnyObject;
}

const ReportPageIntro = ({ text }: ReportPageIntroI) => {
  const { section, subsection, info } = text;
  return (
    <Box sx={sx.introBox}>
      <Heading as="h1" sx={sx.sectionHeading}>
        {section}
      </Heading>
      <Heading as="h2" sx={sx.subsectionHeading}>
        {subsection}
      </Heading>
      {info && <Box sx={sx.infoTextBox}>{parseCustomHtml(info)}</Box>}
    </Box>
  );
};

interface ReportPageIntroI {
  text: {
    section: string;
    subsection: string;
    info?: CustomHtmlElement[];
  };
}

const ReportPageFooter = ({ formId, previousRoute }: ReportPageFooterI) => {
  const navigate = useNavigate();
  return (
    <Box sx={sx.footerBox}>
      <Box>
        <Flex sx={sx.buttonFlex}>
          <Button
            onClick={() => navigate(previousRoute)}
            variant="outline"
            colorScheme="colorSchemes.outline"
            leftIcon={<Icon icon="arrowLeft" />}
          >
            Previous
          </Button>
          <Button
            form={formId}
            type="submit"
            colorScheme="colorSchemes.main"
            rightIcon={<Icon icon="arrowRight" />}
          >
            Save & continue
          </Button>
        </Flex>
        {/* TODO: Add Prince Print Button */}
      </Box>
    </Box>
  );
};

interface ReportPageFooterI {
  formId: string;
  previousRoute: string;
}

const sx = {
  pageContainer: {
    width: "100%",
  },
  reportContainer: {
    flexDirection: "column",
    width: "100%",
    maxWidth: "reportPageWidth",
    marginY: "3.5rem",
    marginLeft: "3.5rem",
  },
  introBox: {
    marginBottom: "2rem",
  },
  sectionHeading: {
    color: "palette.gray",
    fontSize: "md",
  },
  subsectionHeading: {
    fontWeight: "normal",
    fontSize: "4xl",
  },
  infoTextBox: {
    marginTop: "2rem",
    // TODO: finalize inline link styles with design and move this to theme.ts
    "p, span": {
      color: "palette.gray",
    },
    a: {
      color: "palette.main",
      "&:hover": {
        color: "palette.main_darker",
      },
    },
  },
  footerBox: {
    marginTop: "3.5rem",
    borderTop: "1.5px solid var(--chakra-colors-palette-gray_light)",
  },
  buttonFlex: {
    justifyContent: "space-between",
    marginY: "1.5rem",
  },
};
