// components
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Banner } from "../../components/index";
// utils
import { BannerTypes } from "utils/types/types";
// data
import data from "../../data/admin-view.json";

export const Admin = () => (
  <section>
    <Box sx={sx.root} data-testid="admin-view">
      <Flex sx={sx.mainContentFlex}>
        <Box sx={sx.introTextBox}>
          <Heading as="h1" sx={sx.headerText}>
            {data.intro.header}
          </Heading>
          <Text>{data.intro.body}</Text>
          <Button>TEMP: Post new banner data</Button>
        </Box>
        {/* TODO: only show if there's a current banner */}
        <Box sx={sx.currentBannerBox}>
          <Text sx={sx.sectionHeader}>Current Banner</Text>
          <Text>Status: Active/Inactive</Text>
          <Text>Start Date: 1/1/22</Text>
          <Text>End Date: 1/1/22</Text>
          <Banner
            status={BannerTypes.INFO}
            bgColor="palette.alt_lightest"
            accentColor="palette.alt"
            title="Current title"
            description="Current description"
          />
          <Button>Delete Current Banner</Button>
        </Box>
        <Box sx={sx.previewBannerBox}>
          <Text sx={sx.sectionHeader}>Create a New Banner</Text>
          {/* TODO: Add form fields here */}
          <Text>Banner type</Text>
          <Select></Select>
          <Text>Header text</Text>
          <Input isRequired></Input>
          <Text>Body text</Text>
          <Input isRequired></Input>
          <Text>Start date</Text>
          <Flex>
            <Stack>
              <Text>Day</Text>
              <Input isRequired></Input>
            </Stack>
            <Stack>
              <Text>Month</Text>
              <Input isRequired></Input>
            </Stack>
            <Stack>
              <Text>Year</Text>
              <Input isRequired></Input>
            </Stack>
          </Flex>
          <Text>End date</Text>
          <Flex>
            <Stack>
              <Text>Day</Text>
              <Input isRequired></Input>
            </Stack>
            <Stack>
              <Text>Month</Text>
              <Input isRequired></Input>
            </Stack>
            <Stack>
              <Text>Year</Text>
              <Input isRequired></Input>
            </Stack>
          </Flex>

          <Banner
            status={BannerTypes.INFO}
            bgColor="palette.alt_lightest"
            accentColor="palette.alt"
            title="preview title"
            description="preview description"
          />
          <Button>Replace Current Banner</Button>
        </Box>
      </Flex>
    </Box>
  </section>
);

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
