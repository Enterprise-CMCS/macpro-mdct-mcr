import { useState, useContext, useEffect } from "react";
// components
import { Box, Button, Collapse, Flex, Heading, Text } from "@chakra-ui/react";
import {
  AdminBannerContext,
  AdminBannerForm,
  Banner,
  ErrorAlert,
} from "../../components";
// utils
import { checkBannerActivityStatus } from "utils/adminbanner/adminBanner";
import { formatDateUtcToEt } from "utils/time/time";
import { DELETE_BANNER_FAILED } from "utils/constants/constants";
// data
import data from "../../data/admin-view.json";

export const Admin = () => {
  const { bannerData, deleteAdminBanner, writeAdminBanner, errorMessage } =
    useContext(AdminBannerContext);
  const [error, setError] = useState<string | undefined>(errorMessage);
  const bannerIsActive = checkBannerActivityStatus(
    bannerData?.startDate,
    bannerData?.endDate
  );
  useEffect(() => {
    setError(errorMessage);
  }, [errorMessage]);

  const deleteBanner = async () => {
    try {
      await deleteAdminBanner();
    } catch (error: any) {
      setError(DELETE_BANNER_FAILED);
    }
  };

  return (
    <section>
      <Box sx={sx.root} data-testid="admin-view">
        <Flex sx={sx.mainContentFlex}>
          <ErrorAlert error={error} sxOverrides={sx.errorAlert} />
          <Box sx={sx.introTextBox}>
            <Heading as="h1" sx={sx.headerText}>
              {data.intro.header}
            </Heading>
            <Text>{data.intro.body}</Text>
          </Box>
          <Box sx={sx.currentBannerSectionBox}>
            <Text sx={sx.sectionHeader}>Current Banner</Text>
            <Collapse in={!!bannerData?.key}>
              {bannerData?.key && (
                <Flex sx={sx.currentBannerInfo}>
                  <Text sx={sx.currentBannerStatus}>
                    Status:{" "}
                    <span className={bannerIsActive ? "active" : "inactive"}>
                      {bannerIsActive ? "Active" : "Inactive"}
                    </span>
                  </Text>
                  <Text sx={sx.currentBannerDate}>
                    Start Date:{" "}
                    <span>{formatDateUtcToEt(bannerData?.startDate)}</span>
                  </Text>
                  <Text sx={sx.currentBannerDate}>
                    End Date:{" "}
                    <span>{formatDateUtcToEt(bannerData?.endDate)}</span>
                  </Text>
                </Flex>
              )}
              <Flex sx={sx.currentBannerFlex}>
                <Banner bannerData={bannerData} />
                <Button
                  sx={sx.deleteBannerButton}
                  colorScheme="colorSchemes.error"
                  onClick={deleteBanner}
                >
                  Delete Current Banner
                </Button>
              </Flex>
            </Collapse>
            {!bannerData?.key && <Text>There is no current banner</Text>}
          </Box>
          <Flex sx={sx.newBannerBox}>
            <Text sx={sx.sectionHeader}>Create a New Banner</Text>
            <AdminBannerForm writeAdminBanner={writeAdminBanner} />
          </Flex>
        </Flex>
      </Box>
    </section>
  );
};

const sx = {
  root: {
    flexShrink: "0",
  },
  errorAlert: {
    width: "100% !important",
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
  currentBannerSectionBox: {
    width: "100%",
    marginBottom: "2.25rem",
  },
  sectionHeader: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  currentBannerInfo: {
    flexDirection: "column",
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
  currentBannerFlex: {
    flexDirection: "column",
  },
  deleteBannerButton: {
    alignSelf: "end",
    marginTop: "1rem !important",
  },
  newBannerBox: {
    width: "100%",
    flexDirection: "column",
    marginBottom: "2.25rem",
  },
};
