// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { BasicPage, EmailCard, FaqAccordion } from "components";
import verbiage from "verbiage/help-view";

export const Help = () => {
  const { intro, cards, accordionItems } = verbiage;
  return (
    <BasicPage data-testid="help-view">
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
    </BasicPage>
  );
};

const sx = {
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
