import { useEffect } from "react";
// components
import { Box, Collapse, Heading, Link, Text } from "@chakra-ui/react";
import {
  AdminDashSelector,
  Banner,
  PageTemplate,
  TemplateCard,
} from "components";
// utils
import { checkDateRangeStatus, useStore } from "utils";
// verbiage
import verbiage from "verbiage/pages/home";

export const HomePage = () => {
  const { bannerData, bannerActive, setBannerActive } = useStore();
  const { userIsEndUser } = useStore().user ?? {};

  useEffect(() => {
    let bannerActivity = false;
    if (bannerData) {
      bannerActivity = checkDateRangeStatus(
        bannerData.startDate,
        bannerData.endDate
      );
    }
    setBannerActive(bannerActivity);
  }, [bannerData]);

  const showBanner = !!bannerData?.key && bannerActive;
  const { intro, cards } = verbiage;

  return (
    <>
      <Collapse in={showBanner}>
        <Banner bannerData={bannerData} status={"info"} />
      </Collapse>
      <PageTemplate sx={sx.layout}>
        {/* show standard view to state users */}
        {userIsEndUser ? (
          <>
            <Box sx={sx.introTextBox}>
              <Heading as="h1" sx={sx.headerText}>
                {intro.header}
              </Heading>
              <Text>
                {intro.body.preLinkText}
                <Link href={intro.body.linkLocation} isExternal>
                  {intro.body.linkText}
                </Link>
                {intro.body.postLinkText}
              </Text>
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
            />
            <TemplateCard
              templateName="NAAAR"
              verbiage={cards.NAAAR}
              cardprops={sx.card}
            />
          </>
        ) : (
          // show read-only view to non-state users
          <AdminDashSelector verbiage={verbiage.readOnly} />
        )}
      </PageTemplate>
    </>
  );
};

const sx = {
  layout: {
    ".contentFlex": {
      marginTop: "spacer7",
    },
  },
  introTextBox: {
    width: "100%",
    marginBottom: "2.25rem",
  },
  headerText: {
    marginBottom: "spacer2",
    fontSize: "2rem",
    fontWeight: "normal",
  },
  card: {
    marginBottom: "spacer4",
  },
};
