// components
import { Box, Button, Collapse, Flex, Heading, Text } from "@chakra-ui/react";
import { Banner, DateField, TextField } from "../../components/index";
// utils
import { convertDateEtToUtc, formatDateUtcToEt } from "utils/time/time";
import { makeMediaQueryClasses } from "../../utils/useBreakpoint";
import { AdminBannerData, AdminBannerShape } from "utils/types/types";
import { bannerId } from "../../utils/constants/constants";
// data
import data from "../../data/admin-view.json";

// TODO: remove after form fields are wired up
const ADMIN_BANNER_ID = bannerId;
const midnight = { hour: 0, minute: 0, second: 0 };
const oneSecondToMidnight = { hour: 23, minute: 59, second: 59 };
const fakeNewBanner: AdminBannerData = {
  key: ADMIN_BANNER_ID,
  title: "this is the second banner",
  description: "yep the second one",
  link: "with a link!",
  startDate: convertDateEtToUtc({ year: 2022, month: 1, day: 1 }, midnight),
  endDate: convertDateEtToUtc(
    { year: 2022, month: 12, day: 31 },
    oneSecondToMidnight
  ),
};

export const Admin = ({ adminBanner }: Props) => {
  const mqClasses = makeMediaQueryClasses();
  return (
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

          <Flex sx={sx.previewBannerBox}>
            <Text sx={sx.sectionHeader}>Create a New Banner</Text>
            <TextField
              label="Header text"
              placeholder="New banner title"
              name="banner-title-text"
              fieldClassName="passedfieldclass"
            />
            <TextField
              label="Description text"
              placeholder="New banner description"
              multiline
              rows={3}
              name="banner-description-text"
            />
            <TextField
              label="Link (optional)"
              name="banner-link"
              requirementLabel="Optional"
            />
            <Flex sx={sx.dateFieldContainer} className={mqClasses}>
              <DateField label="Start date" hint={null} />
              <DateField label="End date" hint={null} />
            </Flex>
            <Banner
              bannerData={{
                title: "New banner title",
                description: "New banner description",
              }}
            />
            <Button
              sx={sx.replaceBannerButton}
              colorScheme="colorSchemes.main"
              onClick={() => adminBanner.writeAdminBanner(fakeNewBanner)}
            >
              Replace Current Banner
            </Button>
          </Flex>
        </Flex>
      </Box>
    </section>
  );
};

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
  sectionHeader: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  currentBannerSectionBox: {
    width: "100%",
    marginBottom: "2.25rem",
  },
  currentBannerInfo: {
    flexDirection: "column",
    marginBottom: "0.5rem !important",
  },
  currentBannerFlex: {
    flexDirection: "column",
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
    flexDirection: "column",
    marginBottom: "2.25rem",
  },
  dateFieldContainer: {
    ".ds-c-fieldset:first-of-type": {
      marginRight: "3rem",
    },
    "&.tablet, &.mobile": {
      flexDirection: "column",
      ".ds-c-fieldset:first-of-type": {
        marginRight: "0",
      },
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
