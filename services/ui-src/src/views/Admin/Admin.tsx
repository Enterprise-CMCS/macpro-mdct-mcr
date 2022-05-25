import { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// components
import { Box, Button, Collapse, Flex, Heading, Text } from "@chakra-ui/react";
import { Banner, DateField, TextField } from "../../components/index";
// utils
import { formatDateUtcToEt } from "utils/time/time";
import { makeMediaQueryClasses } from "../../utils/useBreakpoint";
import { AdminBannerShape, InputChangeEvent } from "utils/types/types";
// data
import data from "../../data/admin-view.json";

interface FormInput {
  title: string;
  description: string;
  link: string;
  startDate: number;
  startDateDay: number;
  startDateMonth: number;
  startDateYear: number;
  endDateDay: number;
  endDateMonth: number;
  endDateYear: number;
  endDate: number;
}

const schema = yup.object().shape({
  title: yup.string().required("Title text is required"),
  description: yup.string().required("Description text is required"),
  link: yup.string().url("URL must be valid"),
  startDate: yup.number().required("Valid start date is required"),
  startDateYear: yup.number().required().min(2022),
  startDateMonth: yup.number().required().max(12),
  startDateDay: yup.number().required().max(31),
  endDate: yup
    .number()
    .required("Valid end date is required")
    .min(yup.ref("startDate"), "End date cannot be before start date"),
  endDateYear: yup.number().required().min(2022),
  endDateMonth: yup.number().required().max(12),
  endDateDay: yup.number().required().max(31),
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
    const { id, value }: any = e.target;
    setNewBannerData({
      ...newBannerData,
      [id]: value,
    });
    form.setValue(id, value);
  };

  const form = useForm<FormInput>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormInput> = () => {
    adminBanner.writeAdminBanner(newBannerData);
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
            <FormProvider {...{ ...form, onInputChange: handleInputChange }}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    hint="mm/dd/yyyy (12:00:00am)"
                    {...form}
                  />
                  <DateField
                    name="endDate"
                    label="End date"
                    hint="mm/dd/yyyy (11:59:59pm)"
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
