import { useContext } from "react";
// components
import { Box, Collapse, Heading, Text } from "@chakra-ui/react";
import {
  AdminBannerContext,
  Banner,
  BasicPage,
  TemplateCard,
} from "components";
// utils
import { checkDateRangeStatus } from "utils";
import verbiage from "verbiage/pages/home";

export const Home = () => {
  const { bannerData } = useContext(AdminBannerContext);
  const bannerIsActive = checkDateRangeStatus(
    bannerData?.startDate,
    bannerData?.endDate
  );
  const showBanner = !!bannerData.key && bannerIsActive;
  const { intro, cards } = verbiage;
  return (
    <>
      <Collapse in={showBanner}>
        <Banner bannerData={bannerData} />
      </Collapse>
      <BasicPage sx={sx.layout} data-testid="home-view">
        <Box sx={sx.introTextBox}>
          <Heading as="h1" sx={sx.headerText}>
            {intro.header}
          </Heading>
          <Text>{intro.body}</Text>
        </Box>
        <TemplateCard
          templateName="MCPAR"
          verbiage={cards.MCPAR}
          cardprops={sx.card}
        />
        <TemplateCard
          templateName="MLR"
          verbiage={cards.MLR}
          cardprops={sx.card}
          isDisabled
        />
        <TemplateCard
          templateName="NAAAR"
          verbiage={cards.NAAAR}
          cardprops={sx.card}
          isDisabled
        />
      </BasicPage>
    </>
  );
};

const sx = {
  layout: {
    ".contentFlex": {
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
