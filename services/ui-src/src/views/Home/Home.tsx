// components
import { Box, Collapse, Flex, Heading, Text } from "@chakra-ui/react";
import { Banner, TemplateCard } from "../../components/index";
// data
import data from "../../data/home-view.json";

// utils
import { AdminBannerShape } from "utils/types/types";

export const Home = ({ adminBanner }: Props) => {
  const showBanner = !!adminBanner.key && adminBanner.isActive;
  return (
    <section>
      <Box sx={sx.root} data-testid="home-view">
        <Collapse in={showBanner}>
          <Banner bannerData={adminBanner} />
        </Collapse>
        <Flex
          sx={sx.mainContentFlex}
          className={showBanner ? "with-banner" : ""}
        >
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
};

interface Props {
  adminBanner: AdminBannerShape;
}

const sx = {
  root: {
    flexShrink: "0",
  },
  mainContentFlex: {
    flexDirection: "column",
    alignItems: "center",
    margin: "5.5rem auto 0",
    maxWidth: "contentColumnSmall",
    "&.with-banner": {
      marginTop: "3.5rem",
    },
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
