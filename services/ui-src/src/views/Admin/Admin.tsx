// components
import { Box, Button, Collapse, Flex, Heading, Text } from "@chakra-ui/react";
import { Banner, AdminBannerForm } from "../../components/index";
// utils
import { formatDateUtcToEt } from "utils/time/time";
import { AdminBannerShape } from "utils/types/types";
// data
import data from "../../data/admin-view.json";

export const Admin = ({ adminBanner }: Props) => (
  <section>
    <Box sx={sx.root} data-testid="admin-view">
      <Flex sx={sx.mainContentFlex}>
        <Box sx={sx.introTextBox}>
          <Heading as="h1" sx={sx.headerText}>
            {data.intro.header}
          </Heading>
          <Text>{data.intro.body}</Text>
        </Box>
        <Box sx={sx.currentBannerSectionBox}>
          <Text sx={sx.sectionHeader}>Current Banner</Text>
          <Collapse in={!!adminBanner.key}>
            {adminBanner.key && (
              <Flex sx={sx.currentBannerInfo}>
                <Text sx={sx.currentBannerStatus}>
                  Status:{" "}
                  <span
                    className={adminBanner.isActive ? "active" : "inactive"}
                  >
                    {adminBanner.isActive ? "Active" : "Inactive"}
                  </span>
                </Text>
                <Text sx={sx.currentBannerDate}>
                  Start Date:{" "}
                  <span>{formatDateUtcToEt(adminBanner.startDate)}</span>
                </Text>
                <Text sx={sx.currentBannerDate}>
                  End Date:{" "}
                  <span>{formatDateUtcToEt(adminBanner.endDate)}</span>
                </Text>
              </Flex>
            )}
            <Flex sx={sx.currentBannerFlex}>
              <Banner bannerData={adminBanner} />
              <Button
                sx={sx.deleteBannerButton}
                colorScheme="colorSchemes.error"
                onClick={() => adminBanner.deleteAdminBanner()}
              >
                Delete Current Banner
              </Button>
            </Flex>
          </Collapse>
          {!adminBanner.key && <Text>There is no current banner</Text>}
        </Box>
        <Flex sx={sx.newBannerBox}>
          <Text sx={sx.sectionHeader}>Create a New Banner</Text>
          <AdminBannerForm writeAdminBanner={adminBanner.writeAdminBanner} />
        </Flex>
      </Flex>
    </Box>
  </section>
);

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
