// components
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { EmailCard, FaqAccordion } from "../../components/index";
// data
import data from "../../data/faq-view.json";

export const Faq = () => (
  <section>
    <Box sx={sx.root} data-testid="faq-view">
      <Flex sx={sx.mainContentFlex}>
        <Box sx={sx.leadTextBox}>
          <Heading as="h1" sx={sx.headerText}>
            {data.intro.header}
          </Heading>
          <Text>{data.intro.body}</Text>
        </Box>
        <Box sx={sx.faqCardBox}>
          <EmailCard
            verbiage={data.cards.helpdesk}
            icon="settings"
            cardprops={{ ...sx.card, "data-testid": "helpdesk-faq-card" }}
          />
          <EmailCard
            verbiage={data.cards.template}
            icon="spreadsheet"
            cardprops={{ ...sx.card, "data-testid": "template-faq-card" }}
          />
        </Box>
        <Box sx={sx.faqAccordionBox}>
          <FaqAccordion accordionItems={data.accordionItems} />
        </Box>
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
    margin: "5.5rem auto 0",
    maxWidth: "contentColumnSmall",
  },
  leadTextBox: {
    marginBottom: "2.25rem",
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "2rem",
    fontWeight: "normal",
  },
  faqCardBox: {
    width: "100%",
    marginBottom: "3rem",
  },
  card: {
    marginBottom: "1.5rem",
  },
  faqAccordionBox: {
    width: "100%",
    marginBottom: "8rem",
  },
};
