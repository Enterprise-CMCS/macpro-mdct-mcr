// components
import { Box, Flex, Heading, Image, Link, Text } from "@chakra-ui/react";
// utils
import { createEmailLink } from "utils/email/email";
// assets
import warningIcon from "../../assets/images/icon_warning.png";

const cmsHelpEmail = "mdct_help@cms.hhs.gov";

export const NotFound = () => (
  <Box sx={sx.root} data-testid="404-view">
    <Flex sx={sx.mainContentFlex}>
      <Flex sx={sx.heading}>
        <Image src={warningIcon} alt="warning icon" sx={sx.warningIcon} />
        <Heading as="h1" sx={sx.headerText}>
          Page not found
        </Heading>
      </Flex>
      <Heading as="h2" sx={sx.subHeadingText}>
        Sorry, the page you're looking for couldn't be found. It's possible that
        this page has moved, or the address may have been typed incorrectly.
      </Heading>
      <Text sx={sx.descriptionText}>
        Please email{" "}
        <Link href={createEmailLink({ address: cmsHelpEmail })}>
          {cmsHelpEmail}
        </Link>{" "}
        for help or feedback.
      </Text>
      <Text>
        Note: If you were using a bookmark, please reset it once you find the
        correct page.
      </Text>
    </Flex>
  </Box>
);

const sx = {
  root: {
    flexShrink: "0",
  },
  mainContentFlex: {
    flexDirection: "column",
    alignContent: "center",
    margin: "5.5rem auto 0",
    maxWidth: "30.625rem",
  },
  heading: {
    gap: "12px",
    marginBottom: "1rem",
    alignItems: "center",
  },
  warningIcon: {
    boxSize: "2rem",
  },
  headerText: {
    fontSize: "4xl",
    fontWeight: "normal",
  },
  subHeadingText: {
    fontSize: "lg",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  descriptionText: {
    fontSize: "md",
  },
};
