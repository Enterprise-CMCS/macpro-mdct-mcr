// components
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { FaqCard } from "../../components/index";
// data
import faqCardsVerbiage from "../../data/faqCards.json";

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
        <FaqCard
          verbiage={faqCardsVerbiage.helpdesk}
          icon="settings"
          cardprops={{ ...sx.card, "data-testid": "helpdesk-faq-card" }}
        />
        <FaqCard
          verbiage={faqCardsVerbiage.template}
          icon="spreadsheet"
          cardprops={{ ...sx.card, "data-testid": "template-faq-card" }}
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
  card: {
    marginBottom: "1.5rem",
  },
};
