import { useState, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
// components
import { Box, Button, Collapse, Flex, Heading, Text } from "@chakra-ui/react";
import { Banner, DateField, TextField } from "../../components/index";
// utils
import {
  // convertDateEtToUtc,
  formatDateUtcToEt,
} from "utils/time/time";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { makeMediaQueryClasses } from "../../utils/useBreakpoint";
import {
  // AdminBannerData,
  AdminBannerShape,
  InputChangeEvent,
} from "utils/types/types";
// data
import data from "../../data/admin-view.json";

interface FormInput {
  title: string;
  description: string;
  link: string;
  startDate: number;
  endDate: number;
}

const schema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  link: yup.string().url(),
  startDate: yup.number().required(),
  // endDate: yup.number().required(),
});

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
    console.log("changing top level"); // eslint-disable-line no-console
    const { id, value } = e.target;
    setNewBannerData({
      ...newBannerData,
      [id]: value,
    });
  };

  const form = useForm<FormInput>({
    resolver: yupResolver(schema),
  });

  const onError = (errors: any) => {
    console.log(errors); // eslint-disable-line no-console
  };

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log("formdata", data); // eslint-disable-line no-console
    adminBanner.writeAdminBanner(newBannerData);
  };

  useEffect(() => {
    console.log("formData", newBannerData); // eslint-disable-line no-console
  }, [newBannerData]);

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
            <FormProvider {...{ ...form, onInputChange: handleInputChange }}>
              <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                <TextField
                  name="title"
                  label="Title text"
                  placeholder="New banner title"
                />
                <TextField
                  name="description"
                  label="Description text"
                  placeholder="New banner description"
                  multiline
                  rows={3}
                />
                <TextField
                  name="link"
                  label="Link"
                  requirementLabel="Optional"
                />
                <Flex sx={sx.dateFieldContainer} className={mqClasses}>
                  <DateField
                    name="startDate"
                    label="Start date"
                    hint={null}
                    {...form}
                  />
                  <DateField
                    name="endDate"
                    label="End date"
                    hint={null}
                    {...form}
                  />
                </Flex>
                <Banner bannerData={newBannerData} />
                <Button
                  type="submit"
                  sx={sx.replaceBannerButton}
                  colorScheme="colorSchemes.main"
                >
                  Replace Current Banner
                </Button>
              </form>
            </FormProvider>
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
