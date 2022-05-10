// components
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Banner, TemplateCard } from "../../components/index";
// utils
import { BannerTypes } from "utils/types/types";
// data
import templateCardsVerbiage from "../../data/templateCards.json";

export const Home = () => (
  <section>
    <Box sx={sx.root} data-testid="home-view">
      <Banner
        status={BannerTypes.INFO}
        bgColor="palette.alt_lightest"
        accentColor="palette.alt"
        title="Welcome to the new Managed Care Reporting tool!"
        description="Each state must submit one report per program."
      />
      <Flex sx={sx.mainContentFlex}>
        <Box sx={sx.leadTextBox}>
          <Heading as="h1" sx={sx.headerText}>
            Your fiscal year 2022 templates
          </Heading>
          <Text>
            Download these templates to begin gathering administrative data for
            your Medicaid managed care program. Submit your completed report to
            the Centers for Medicare and Medicaid Services (CMS) through this
            website beginning October 2022.
          </Text>
        </Box>
        <TemplateCard
          verbiage={templateCardsVerbiage.MCPAR}
          cardprops={{ ...sx.card, "data-testid": "mcpar-template-card" }}
        />
        <TemplateCard
          verbiage={templateCardsVerbiage.MLR}
          cardprops={{ ...sx.card, "data-testid": "mlr-template-card" }}
        />
        <TemplateCard
          verbiage={templateCardsVerbiage.NAAAR}
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
    marginBottom: "2rem",
  },
};
