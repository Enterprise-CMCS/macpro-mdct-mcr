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
import { makeMediaQueryClasses } from "../../utils/useBreakpoint";
// data
import data from "../../data/admin-view.json";

import { listBanners } from "utils/api/requestMethods";

export const Admin = () => {
  const mqClasses = makeMediaQueryClasses();
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
          <Button
            onClick={async () => {
              await listBanners({});
            }}
          >
            List banner
          </Button>
          <Box sx={sx.introTextBox}>
            <Heading as="h1" sx={sx.headerText}>
              {data.intro.header}
            </Heading>
            <Text>{data.intro.body}</Text>
          </Box>
          <Box sx={sx.currentBannerBox}>
            <Text sx={sx.sectionHeader}>Current Banner</Text>
            {bannerData ? (
              <Stack>
                <Stack sx={sx.currentBannerInfo}>
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
                </Stack>
                <Banner
                  status={BannerTypes.INFO}
                  bgColor="palette.alt_lightest"
                  accentColor="palette.alt"
                  title={bannerData.title}
                  body={bannerData.body}
                />
                <Button
                  sx={sx.deleteBannerButton}
                  colorScheme="colorSchemes.error"
                >
                  Delete Current Banner
                </Button>
              </Stack>
            ) : (
              <Text>There is no current banner</Text>
            )}
          </Box>

          <Stack sx={sx.previewBannerBox}>
            <Text sx={sx.sectionHeader}>Create a New Banner</Text>
            <TextField label="Header text" placeholder="New banner title" />
            <TextField label="Body text" placeholder="New banner body" />
            <Flex sx={sx.dateFieldContainer} className={mqClasses}>
              <Stack mt="0.5rem">
                <Text>Start date</Text>
                <Flex>
                  <TextField sx={sx.dateField} label="Month" />
                  <TextField sx={sx.dateField} label="Day" />
                  <TextField sx={sx.dateField} label="Year" />
                </Flex>
              </Stack>
              <Stack mt="0.5rem">
                <Text>End date</Text>
                <Flex>
                  <TextField sx={sx.dateField} label="Month" />
                  <TextField sx={sx.dateField} label="Day" />
                  <TextField sx={sx.dateField} label="Year" />
                </Flex>
              </Stack>
            </Flex>
            <Banner
              status={BannerTypes.INFO}
              bgColor="palette.alt_lightest"
              accentColor="palette.alt"
              title="New banner title"
              body="New banner description"
            />
            <Button sx={sx.replaceBannerButton} colorScheme="colorSchemes.main">
              Replace Current Banner
            </Button>
          </Stack>
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
  currentBannerInfo: {
    marginBottom: "0.5rem !important",
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
  deleteBannerButton: {
    alignSelf: "end",
    marginTop: "1rem !important",
  },
  previewBannerBox: {
    width: "100%",
    marginBottom: "2.25rem",
  },
  dateFieldContainer: {
    marginBottom: "0.5rem !important",
    "&.tablet, &.mobile": {
      flexDirection: "column",
    },
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "2rem",
    fontWeight: "normal",
  },
  dateField: {
    width: "80%",
  },
  replaceBannerButton: {
    marginTop: "1rem !important",
    alignSelf: "end",
  },
};
