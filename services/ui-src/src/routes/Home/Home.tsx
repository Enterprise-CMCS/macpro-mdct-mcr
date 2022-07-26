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

/// TEMP
import { DELETE_BANNER_FAILED } from "verbiage/errors";
import { writeReportToDb } from "utils/api/requestMethods/report";
import { Button } from "@chakra-ui/react"; // eslint-disable-line
/// TEMP

export const Home = () => {
  const { bannerData } = useContext(AdminBannerContext);
  const bannerIsActive = checkDateRangeStatus(
    bannerData?.startDate,
    bannerData?.endDate
  );
  const showBanner = !!bannerData.key && bannerIsActive;
  const { intro, cards } = verbiage;

  //TEMP
  const writeReport = async () => {
    const report = {
      key: "AK2022",
      report: {
        text: "this is body",
        value: "it works",
        array: ["array1", "array2"],
      },
    };
    try {
      await writeReportToDb(report);
    } catch (error: any) {
      console.log(DELETE_BANNER_FAILED);
    }
  };
  //TEMP

  return (
    <>
      <Collapse in={showBanner}>
        <Banner bannerData={bannerData} />
      </Collapse>
      {/*TEMP */}
      <Box sx={sx.introTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          Click here to submit report data
        </Heading>
        <Button onClick={writeReport}>Write report</Button>
      </Box>
      {/*TEMP */}
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
