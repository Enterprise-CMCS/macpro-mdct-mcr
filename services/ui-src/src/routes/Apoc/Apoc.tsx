import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Form, Icon, ReportPage } from "components";
// data
import { pageJson } from "verbiage/forms/aPointOfContact";

const onSubmit = () => {
  console.log("on submit called"); // eslint-disable-line no-console
};

interface ReportPageIntroI {
  text: {
    section: string;
    subsection: string;
    info?: string;
  };
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

interface ReportPageFooterI {
  formId: string;
}

const ReportPageFooter = ({ formId }: ReportPageFooterI) => {
  const navigate = useNavigate();
  return (
    <Box sx={sx.footerBox}>
      <Box>
        <Flex sx={sx.buttonFlex}>
          <Button
            onClick={() => navigate("/mcpar")}
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
        {/* TODO: Add Prince Print Button here */}
      </Box>
    </Box>
  );
};

export const Apoc = () => {
  const { intro, form } = pageJson;
  return (
    <ReportPage data-testid={form.id}>
      <ReportPageIntro text={intro} />
      <Form id={form.id} formJson={form} onSubmit={onSubmit} />
      <ReportPageFooter formId={form.id} />
    </ReportPage>
  );
};

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
