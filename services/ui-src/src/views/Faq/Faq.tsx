// components
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { TemplateCard } from "../../components/index";
// data
import templateCardsVerbiage from "../../data/templateCards.json";

export const Faq = () => (
  <section>
    <Box sx={sx.root} data-testid="faq-view">
      <Flex sx={sx.mainContentFlex}>
        <Box sx={sx.leadTextBox}>
          <Heading as="h1" sx={sx.headerText}>
            How can we help you?
          </Heading>
          <Text as="body">
            Question or feedback? Please email us and we will respond as soon as
            possible. You can also review our frequently asked questions below.
          </Text>
        </Box>
        <TemplateCard verbiage={templateCardsVerbiage.MCPAR}></TemplateCard>
        <TemplateCard verbiage={templateCardsVerbiage.MLR}></TemplateCard>
        <TemplateCard verbiage={templateCardsVerbiage.NAAAR}></TemplateCard>
      </Flex>
    </Box>
  </section>
);

const sx = {
  root: {
    flexShrink: "0",
  },
  mainContentFlex: {
    flexDirection: "column",
    alignItems: "center",
    margin: "0 auto",
    maxWidth: "46rem",
  },
  leadTextBox: {
    marginBottom: "2.25rem",
  },
  headerText: {
    fontSize: "2rem",
    fontWeight: "normal",
  },
};
