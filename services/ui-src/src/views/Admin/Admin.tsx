import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
// components
import { Box, Button, Collapse, Flex, Heading, Text } from "@chakra-ui/react";
import { Banner, DateField, TextField } from "../../components/index";
// utils
import {
  // convertDateEtToUtc,
  formatDateUtcToEt,
} from "utils/time/time";
import { makeMediaQueryClasses } from "../../utils/useBreakpoint";
import {
  // AdminBannerData,
  AdminBannerShape,
  InputChangeEvent,
} from "utils/types/types";
// data
import data from "../../data/admin-view.json";

/*
 * const dateMaker = convertDateEtToUtc(
 *   { year: 2022, month: 1, day: 1 },
 *   midnight
 * );
 */

/*
 * const midnight = { hour: 0, minute: 0, second: 0 };
 * const oneSecondToMidnight = { hour: 23, minute: 59, second: 59 };
 */

interface FormInput {
  title: string;
}

export const Admin = ({ adminBanner }: Props) => {
  const mqClasses = makeMediaQueryClasses();

  const [newBannerData, setNewBannerData] = useState({
    key: process.env.REACT_APP_BANNER_ID!,
    title: "New banner title",
    description: "New banner description",
    startDate: 0,
    endDate: 0,
  });

  const handleInputChange = (e: InputChangeEvent) => {
    const { id, value } = e.target;
    setNewBannerData({
      ...newBannerData,
      [id]: value,
    });
  };

  const { control, handleSubmit } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
  };

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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="title"
                control={control}
                defaultValue=""
                render={({ field: { onChange, name } }) => (
                  <TextField
                    name={name}
                    id="title"
                    label="Title text"
                    placeholder="New banner title"
                    onChange={(value: any) => {
                      onChange(value);
                      handleInputChange(value);
                    }}
                  />
                )}
              />
              <TextField
                id="description"
                label="Description text"
                placeholder="New banner description"
                name="banner-description-text"
                multiline
                rows={3}
                onChange={handleInputChange}
              />
              <TextField
                id="link"
                label="Link (optional)"
                name="banner-link"
                requirementLabel="Optional"
                onChange={handleInputChange}
              />
              <Flex sx={sx.dateFieldContainer} className={mqClasses}>
                <DateField label="Start date" hint={null} />
                <DateField label="End date" hint={null} />
              </Flex>
              <Banner bannerData={newBannerData} />
              <Button
                type="submit"
                sx={sx.replaceBannerButton}
                colorScheme="colorSchemes.main"
                onClick={() => adminBanner.writeAdminBanner(newBannerData)}
              >
                Replace Current Banner
              </Button>
            </form>
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
