// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { EmailCard, FaqAccordion, PageTemplate } from "components";
import verbiage from "verbiage/pages/help";
import { AnyObject } from "types";

export const HelpPage = () => {
  const { intro, cards, accordionItems } = verbiage;
  return (
    <PageTemplate>
      <Box sx={sx.leadTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          {intro.header}
        </Heading>
        <Text>{intro.body}</Text>
      </Box>
      <Box sx={sx.emailCardBox}>
        {cards.map((item: AnyObject, index: number) => (
          <EmailCard
            key={index}
            verbiage={item}
            icon={item.icon}
            cardprops={sx.card}
          />
        ))}
      </Box>
      {accordionItems.length > 0 && (
        <Box sx={sx.faqAccordionBox}>
          <FaqAccordion accordionItems={accordionItems} />
        </Box>
      )}
    </PageTemplate>
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
