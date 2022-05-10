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
          <Text>
            Question or feedback? Please email us and we will respond as soon as
            possible. You can also review our frequently asked questions below.
          </Text>
        </Box>
        <TemplateCard
          verbiage={templateCardsVerbiage.MCPAR}
          cardprops={{ marginBottom: "2rem" }}
          data-testid="mcpar-template-card"
        />
        <TemplateCard
          verbiage={templateCardsVerbiage.MLR}
          cardprops={{ marginBottom: "2rem" }}
          data-testid="mlr-template-card"
        />
        <TemplateCard
          verbiage={templateCardsVerbiage.NAAAR}
          cardprops={{ marginBottom: "2rem" }}
          data-testid="naaar-template-card"
        />
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
    margin: "2.5rem auto 0",
    maxWidth: "46rem",
  },
  leadTextBox: {
    marginBottom: "2.25rem",
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "2rem",
    fontWeight: "normal",
  },
};
