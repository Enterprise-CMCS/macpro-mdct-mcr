import { ComponentClass } from "react";
import { Helmet as HelmetImport, HelmetProps } from "react-helmet";
// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { EmailCard, FaqAccordion, PageTemplate } from "components";
// types
import { AnyObject, FaqItem } from "types";
// verbiage
import verbiage from "verbiage/pages/help";

export const HelpPage = () => {
  const { intro, cards, accordionItems } = verbiage;
  const Helmet = HelmetImport as ComponentClass<HelmetProps>;
  return (
    <PageTemplate>
      {/* page title */}
      <Helmet>
        <title>{verbiage.title}</title>
      </Helmet>
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
          <FaqAccordion accordionItems={accordionItems as FaqItem[]} />
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
    marginBottom: "spacer2",
    fontSize: "2rem",
    fontWeight: "normal",
  },
  emailCardBox: {
    width: "100%",
    marginBottom: "spacer6",
  },
  card: {
    marginBottom: "spacer3",
  },
  faqAccordionBox: {
    width: "100%",
    marginBottom: "8rem",
  },
};
