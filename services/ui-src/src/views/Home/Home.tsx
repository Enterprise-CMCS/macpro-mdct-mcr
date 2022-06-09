import { useContext } from "react";
// components
import { Box, Collapse, Flex, Heading, Text } from "@chakra-ui/react";
import {
  AdminBannerContext,
  Banner,
  TemplateCard,
} from "../../components/index";
// utils
import { checkBannerActivityStatus } from "utils/adminbanner/adminBanner";
// data
import data from "../../data/home-view.json";

export const Home = () => {
  const { bannerData } = useContext(AdminBannerContext);
  const bannerIsActive = checkBannerActivityStatus(
    bannerData?.startDate,
    bannerData?.endDate
  );
  const showBanner = !!bannerData.key && bannerIsActive;

  return (
    <section>
      <Box sx={sx.root} data-testid="home-view">
        <Collapse in={showBanner}>
          <Banner bannerData={bannerData} />
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
            templateName="MCPAR"
            verbiage={data.cards.MCPAR}
            cardprops={{ ...sx.card, "data-testid": "mcpar-template-card" }}
          />
          <TemplateCard
            templateName="MLR"
            verbiage={data.cards.MLR}
            cardprops={{ ...sx.card, "data-testid": "mlr-template-card" }}
          />
          <TemplateCard
            templateName="NAAAR"
            verbiage={data.cards.NAAAR}
            cardprops={{ ...sx.card, "data-testid": "naaar-template-card" }}
          />
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
