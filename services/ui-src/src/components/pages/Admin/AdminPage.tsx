import React, { useContext } from "react";
// components
import {
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  Text,
  Spinner,
} from "@chakra-ui/react";
import {
  AdminBannerContext,
  AdminBannerForm,
  Banner,
  ErrorAlert,
  PageTemplate,
} from "components";
// types
import { AdminBannerData, AlertTypes } from "types";
// utils
import { checkDateRangeStatus, convertDateUtcToEt, useStore } from "utils";
// verbiage
import verbiage from "verbiage/pages/admin";

export const AdminPage = () => {
  const { deleteAdminBanner, writeAdminBanner } =
    useContext(AdminBannerContext);

  // state management
  const { allBanners, bannerLoading, bannerErrorMessage, bannerDeleting } =
    useStore();

  const BannerPreview = (banner: AdminBannerData) => {
    const bannerActive = checkDateRangeStatus(banner.startDate, banner.endDate);
    return (
      <React.Fragment key={banner.key}>
        <Flex sx={sx.currentBannerInfo}>
          <Text sx={sx.currentBannerStatus}>
            Status:{" "}
            <span className={bannerActive ? "active" : "inactive"}>
              {bannerActive ? "Active" : "Inactive"}
            </span>
          </Text>
          <Text sx={sx.currentBannerDate}>
            Start Date: <span>{convertDateUtcToEt(banner?.startDate)}</span>
          </Text>
          <Text sx={sx.currentBannerDate}>
            End Date: <span>{convertDateUtcToEt(banner?.endDate)}</span>
          </Text>
        </Flex>
        <Flex sx={sx.currentBannerFlex}>
          <Banner status={AlertTypes.INFO} bannerData={banner} />
          <Button
            variant="danger"
            sx={sx.deleteBannerButton}
            onClick={() => deleteAdminBanner(banner.key)}
          >
            {bannerDeleting ? <Spinner size="md" /> : "Delete Banner"}
          </Button>
        </Flex>
      </React.Fragment>
    );
  };

  return (
    <PageTemplate sxOverride={sx.layout} data-testid="admin-view">
      <ErrorAlert error={bannerErrorMessage} sxOverride={sx.errorAlert} />
      <Box sx={sx.introTextBox}>
        <Heading as="h1" id="AdminHeader" tabIndex={-1} sx={sx.headerText}>
          {verbiage.intro.header}
        </Heading>
        <Text>{verbiage.intro.body}</Text>
      </Box>
      <Box sx={sx.currentBannerSectionBox}>
        <Text sx={sx.sectionHeader}>Current Banner(s)</Text>
        {bannerLoading ? (
          <Flex sx={sx.spinnerContainer}>
            <Spinner size="md" />
          </Flex>
        ) : (
          <>
            <Collapse in={allBanners && allBanners?.length > 0}>
              {allBanners?.map((banner) => BannerPreview(banner))}
            </Collapse>
            {!allBanners?.length && <Text>There is no current banner</Text>}
          </>
        )}
      </Box>
      <Flex sx={sx.newBannerBox}>
        <Text sx={sx.sectionHeader}>Create a New Banner</Text>
        <AdminBannerForm writeAdminBanner={writeAdminBanner} />
      </Flex>
    </PageTemplate>
  );
};

const sx = {
  layout: {
    ".contentFlex": {
      marginTop: "3.5rem",
    },
  },
  errorAlert: {
    width: "100% !important",
    marginTop: "-4rem",
    marginBottom: "2rem",
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
  spinnerContainer: {
    marginTop: "0.5rem",
    ".ds-c-spinner": {
      "&:before": {
        borderColor: "palette.black",
      },
      "&:after": {
        borderLeftColor: "palette.black",
      },
    },
  },
  deleteBannerButton: {
    width: "10rem",
    alignSelf: "end",
    marginTop: "-1rem",
  },
  newBannerBox: {
    width: "100%",
    flexDirection: "column",
    marginBottom: "2.25rem",
  },
};
