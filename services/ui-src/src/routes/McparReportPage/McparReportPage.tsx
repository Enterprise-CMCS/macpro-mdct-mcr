import { useState } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Error, Form, Icon, ReportPage, Sidebar } from "components";
// utils
import {
  findRoute,
  hydrateFormFields,
  useUser,
  writeReport,
  writeReportStatus,
} from "utils";
import { AnyObject, UserRoles } from "types";
import { WRITE_REPORT_FAILED } from "verbiage/errors";
// form data
import { mcparRoutes } from "forms/mcpar";
import { reportSchema } from "forms/mcpar/reportSchema";

export const McparReportPage = ({ pageJson }: Props) => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const { path, intro, form } = pageJson;

  const temporaryHydrationData = {
    stateName: "Temporary state name",
    programName: "Temporary program name",
    reportingPeriodStartDate: "xx/xx/xxxx",
    reportingPeriodEndDate: "xx/xx/xxxx",
    reportSubmissionDate: "xx/xx/xxxx",
  };

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
    if (userRole === UserRoles.STATE_USER) {
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
      try {
        await writeReport(report);
        await writeReportStatus(reportStatus);
      } catch (error: any) {
        console.log(WRITE_REPORT_FAILED); // eslint-disable-line
        setError(true);
      }
    }
    navigate(nextRoute);
  };
  // TODO: HYDRATION
  form.fields = hydrateFormFields(form.fields, temporaryHydrationData);

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
      {info && <Text sx={sx.infoText}>{info}</Text>}
    </Box>
  );
};

interface ReportPageIntroI {
  text: {
    section: string;
    subsection: string;
    info?: string;
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
  infoText: {
    marginTop: "2rem",
    color: "palette.gray",
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
