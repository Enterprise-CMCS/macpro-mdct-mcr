import { useState, useContext, useEffect } from "react";
// components
import { Box, Button, Collapse, Flex, Heading, Text } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
import {
  AdminBannerContext,
  AdminBannerForm,
  Banner,
  ErrorAlert,
  PageTemplate,
} from "components";
// utils
import { checkDateRangeStatus, convertDateUtcToEt } from "utils";
import { bannerErrors } from "verbiage/errors";
import verbiage from "verbiage/pages/admin";

export const AdminPage = () => {
  const {
    bannerData,
    deleteAdminBanner,
    writeAdminBanner,
    isLoading,
    errorMessage,
  } = useContext(AdminBannerContext);
  const [error, setError] = useState<string | undefined>(errorMessage);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [isBannerActive, setIsBannerActive] = useState<boolean>(false);

  useEffect(() => {
    let bannerActivity = false;
    if (bannerData) {
      bannerActivity = checkDateRangeStatus(
        bannerData.startDate,
        bannerData.endDate
      );
    }
    setIsBannerActive(bannerActivity);
  }, [bannerData]);

  useEffect(() => {
    setError(errorMessage);
  }, [errorMessage]);

  const deleteBanner = async () => {
    setDeleting(true);
    try {
      await deleteAdminBanner();
    } catch (error: any) {
      setError(bannerErrors.DELETE_BANNER_FAILED);
    }
    setDeleting(false);
  };

  return (
    <PageTemplate sxOverride={sx.layout} data-testid="admin-view">
      <ErrorAlert error={error} sxOverride={sx.errorAlert} />
      <Box sx={sx.introTextBox}>
        <Heading as="h1" id="AdminHeader" tabIndex={-1} sx={sx.headerText}>
          {verbiage.intro.header}
        </Heading>
        <Text>{verbiage.intro.body}</Text>
      </Box>
      <Box sx={sx.currentBannerSectionBox}>
        <Text sx={sx.sectionHeader}>Current Banner</Text>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Collapse in={!!bannerData?.key}>
              {bannerData && (
                <>
                  <Flex sx={sx.currentBannerInfo}>
                    <Text sx={sx.currentBannerStatus}>
                      Status:{" "}
                      <span className={isBannerActive ? "active" : "inactive"}>
                        {isBannerActive ? "Active" : "Inactive"}
                      </span>
                    </Text>
                    <Text sx={sx.currentBannerDate}>
                      Start Date:{" "}
                      <span>{convertDateUtcToEt(bannerData?.startDate)}</span>
                    </Text>
                    <Text sx={sx.currentBannerDate}>
                      End Date:{" "}
                      <span>{convertDateUtcToEt(bannerData?.endDate)}</span>
                    </Text>
                  </Flex>
                  <Flex sx={sx.currentBannerFlex}>
                    <Banner bannerData={bannerData} />
                    <Button
                      variant="danger"
                      sx={sx.deleteBannerButton}
                      onClick={deleteBanner}
                    >
                      {deleting ? (
                        <Spinner size="small" />
                      ) : (
                        "Delete Current Banner"
                      )}
                    </Button>
                  </Flex>
                </>
              )}
            </Collapse>
            {!bannerData && <Text>There is no current banner</Text>}
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
  deleteBannerButton: {
    width: "13.3rem",
    alignSelf: "end",
    marginTop: "1rem !important",
  },
  newBannerBox: {
    width: "100%",
    flexDirection: "column",
    marginBottom: "2.25rem",
  },
};
