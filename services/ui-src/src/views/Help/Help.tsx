// components
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { EmailCard, FaqAccordion } from "components";
import verbiage from "verbiage/help-view";

export const Help = () => {
  const { intro, cards, accordionItems } = verbiage;
  return (
    <section>
      <Box sx={sx.root} data-testid="help-view">
        <Flex sx={sx.mainContentFlex}>
          <Box sx={sx.leadTextBox}>
            <Heading as="h1" sx={sx.headerText}>
              {intro.header}
            </Heading>
            <Text>{intro.body}</Text>
          </Box>
          <Box sx={sx.emailCardBox}>
            <EmailCard
              verbiage={cards.helpdesk}
              icon="settings"
              cardprops={sx.card}
            />
            <EmailCard
              verbiage={cards.template}
              icon="spreadsheet"
              cardprops={sx.card}
            />
          </Box>
          <Box sx={sx.faqAccordionBox}>
            <FaqAccordion accordionItems={accordionItems} />
          </Box>
        </Flex>
      </Box>
    </section>
  );
};

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
  emailCardBox: {
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
