// components
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Banner, TemplateCard } from "../../components/index";
// data
import data from "../../data/home-view.json";

export const Home = () => (
  <section>
    <Box sx={sx.root} data-testid="home-view">
      <Banner
        title="Welcome to the new Managed Care Reporting tool!"
        description="Each state must submit one report per program."
      />
      <Flex sx={sx.mainContentFlex}>
        <Box sx={sx.introTextBox}>
          <Heading as="h1" sx={sx.headerText}>
            {data.intro.header}
          </Heading>
          <Text>{data.intro.body}</Text>
        </Box>
        <TemplateCard
          verbiage={data.cards.MCPAR}
          cardprops={{ ...sx.card, "data-testid": "mcpar-template-card" }}
        />
        <TemplateCard
          verbiage={data.cards.MLR}
          cardprops={{ ...sx.card, "data-testid": "mlr-template-card" }}
        />
        <TemplateCard
          verbiage={data.cards.NAAAR}
          cardprops={{ ...sx.card, "data-testid": "naar-template-card" }}
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
    margin: "3.5rem auto 0",
    maxWidth: "contentColumnSmall",
  },
  introTextBox: {
    width: "100%",
    marginBottom: "2.25rem",
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "2rem",
    fontWeight: "normal",
  },
  card: {
    marginBottom: "2rem",
  },
};
