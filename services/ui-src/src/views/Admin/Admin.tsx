import { useState, useEffect } from "react";
// components
import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { Banner, TextField } from "../../components/index";
// utils
import {
  checkBannerActiveDates,
  formatDate,
  makeStartDate,
  makeEndDate,
} from "utils/banner/banner";
import { BannerShape, BannerTypes } from "utils/types/types";
// data
import data from "../../data/admin-view.json";

export const Admin = () => {
  const [bannerData, setBannerData] = useState<BannerShape | null>(null);
  const [isBannerActive, setIsBannerActive] = useState<boolean>(false);

  useEffect(() => {
    // TODO: fetch current banner data from db
    const mockBannerData: BannerShape = {
      title: "Current banner title",
      body: "Current banner body",
      startDate: makeStartDate({ year: 2022, month: 1, day: 1 }), // 1656648000000
      endDate: makeEndDate({ year: 2022, month: 12, day: 31 }), // 1672549199000
    };
    setBannerData(mockBannerData);
  }, []);

  useEffect(() => {
    if (bannerData) {
      setIsBannerActive(
        checkBannerActiveDates(bannerData.startDate, bannerData.endDate)
      );
    }
  }, [bannerData]);

  return (
    <section>
      <Box sx={sx.root} data-testid="admin-view">
        <Flex sx={sx.mainContentFlex}>
          {/* TODO: remove */}
          <Flex mb="1rem">
            <Button m="1rem">TEMP: Fetch banner data from db</Button>
            <Button m="1rem">TEMP: Post new banner data to db</Button>
          </Flex>

          <Box sx={sx.introTextBox}>
            <Heading as="h1" sx={sx.headerText}>
              {data.intro.header}
            </Heading>
            <Text>{data.intro.body}</Text>
          </Box>
          <Box sx={sx.currentBannerBox}>
            <Text sx={sx.sectionHeader}>Current Banner</Text>
            {bannerData ? (
              <>
                <Text sx={sx.currentBannerStatus}>
                  Status:{" "}
                  <span className={isBannerActive ? "active" : "inactive"}>
                    {isBannerActive ? "Active" : "Inactive"}
                  </span>
                </Text>
                <Text sx={sx.currentBannerDate}>
                  Start Date: <span>{formatDate(bannerData.startDate)}</span>
                </Text>
                <Text sx={sx.currentBannerDate}>
                  End Date: <span>{formatDate(bannerData.endDate)}</span>
                </Text>
                <Banner
                  status={BannerTypes.INFO}
                  bgColor="palette.alt_lightest"
                  accentColor="palette.alt"
                  title={bannerData.title}
                  body={bannerData.body}
                />
                <Button>Delete Current Banner</Button>
              </>
            ) : (
              <Text>There is no current banner</Text>
            )}
          </Box>

          <Box sx={sx.previewBannerBox}>
            <Text sx={sx.sectionHeader}>Create a New Banner</Text>
            <TextField label="Header text" />
            <TextField label="Body text" />

            <Flex>
              <Stack>
                <Text>Start date</Text>
                <Flex>
                  <TextField label="Month" />
                  <TextField label="Day" />
                  <TextField label="Year" />
                </Flex>
              </Stack>
              <Stack>
                <Text>End date</Text>
                <Flex>
                  <TextField label="Month" />
                  <TextField label="Day" />
                  <TextField label="Year" />
                </Flex>
              </Stack>
            </Flex>
            <Banner
              status={BannerTypes.INFO}
              bgColor="palette.alt_lightest"
              accentColor="palette.alt"
              title="preview title"
              body="preview description"
            />
            <Button>Replace Current Banner</Button>
          </Box>
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
    margin: "3.5rem auto 0",
    maxWidth: "contentColumnSmall",
  },
  introTextBox: {
    width: "100%",
    marginBottom: "2.25rem",
  },
  sectionHeader: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  currentBannerBox: {
    width: "100%",
    marginBottom: "2.25rem",
  },
  currentBannerStatus: {
    span: {
      marginLeft: "0.5rem",
      "&.active": {
        color: "palette.success",
      },
      "&.inactive": {
        color: "palette.error",
      },
    },
  },
  currentBannerDate: {
    span: {
      marginLeft: "0.5rem",
    },
  },
  previewBannerBox: {
    width: "100%",
    marginBottom: "2.25rem",
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "2rem",
    fontWeight: "normal",
  },
};
