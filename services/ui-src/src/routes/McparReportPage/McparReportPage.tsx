import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Form, Icon, ReportPage, Sidebar } from "components";
// utils
import { hydrateFormFields, findRoute } from "utils";
import { AnyObject } from "types";
// form data
import { mcparRoutes } from "forms/mcpar";
import { reportSchema } from "forms/mcpar/reportSchema";

/// TEMP
import { DELETE_BANNER_FAILED } from "verbiage/errors";
import { writeReport } from "utils/api/requestMethods/report";
/// TEMP

export const McparReportPage = ({ pageJson }: Props) => {
  const navigate = useNavigate();
  const { path, intro, form } = pageJson;

  // make routes
  const previousRoute = findRoute(mcparRoutes, path, "previous", "/mcpar");
  const nextRoute = findRoute(mcparRoutes, path, "next", "/mcpar");

  const onSubmit = async (formData: any) => {
    console.log("running submit");
    console.log("formData", formData);
    ///TEST
    const report = {
      key: "AK2022",
      report: formData,
    };
    try {
      await writeReport(report);
    } catch (error: any) {
      console.log(DELETE_BANNER_FAILED);
    }
    /// TEST
    navigate(nextRoute);
  };

  form.fields = await hydrateFormFields(form.fields);

  return (
    <ReportPage data-testid={form.id}>
      <Flex sx={sx.pageContainer}>
        <Sidebar />
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
