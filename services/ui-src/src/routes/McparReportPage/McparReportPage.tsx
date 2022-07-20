import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Form, Icon, ReportPage } from "components";
// utils
import { hydrateFormFields, makeNextRoute, makePreviousRoute } from "utils";
import { AnyObject } from "types";
// form data
import { mcparPageNavigationOrder as pageNavOrder } from "forms/mcpar";
import { reportSchema } from "forms/mcpar/reportSchema";

export const McparReportPage = ({ pageJson }: Props) => {
  const navigate = useNavigate();
  const { path, intro, form } = pageJson;

  const temporaryHydrationData = {
    stateName: "Temporary state name",
    programName: "Temporary program name",
    reportingPeriodStartDate: "xx/xx/xxxx",
    reportingPeriodEndDate: "xx/xx/xxxx",
    reportSubmissionDate: "xx/xx/xxxx",
  };

  // make routes
  const previousRoute = makePreviousRoute(pageNavOrder, path);
  const nextRoute = makeNextRoute(pageNavOrder, path);

  const onSubmit = () => {
    // TODO: Wire up submit functionality
    navigate(nextRoute);
  };
  form.fields = hydrateFormFields(form.fields, temporaryHydrationData);

  return (
    <ReportPage data-testid={form.id}>
      <ReportPageIntro text={intro} />
      <Form
        id={form.id}
        formJson={form}
        formSchema={reportSchema[form.id as keyof typeof reportSchema]}
        onSubmit={onSubmit}
      />
      <ReportPageFooter formId={form.id} previousRoute={previousRoute} />
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
            Continue
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
