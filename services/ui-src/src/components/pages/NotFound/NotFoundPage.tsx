// components
import { Flex, Heading, Image, Link, Text } from "@chakra-ui/react";
import { PageTemplate } from "components";
// utils
import { createEmailLink } from "utils/other/email";
// verbiage
import verbiage from "verbiage/pages/not-found";
// assets
import warningIcon from "assets/icons/icon_warning.png";

export const NotFoundPage = () => {
  const { header, subHeading, emailText, body } = verbiage;
  const { preLinkText, cmsEmail, postLinkText } = emailText;

  return (
    <PageTemplate sxOverride={sx.layout}>
      <Flex sx={sx.heading}>
        <Image src={warningIcon} alt="warning icon" sx={sx.warningIcon} />
        <Heading as="h1" sx={sx.headerText}>
          {header}
        </Heading>
      </Flex>
      <Heading as="h2" sx={sx.subHeadingText}>
        {subHeading}
      </Heading>
      <Text sx={sx.descriptionText}>
        {preLinkText}
        <Link href={createEmailLink({ address: cmsEmail })}>{cmsEmail}</Link>
        {postLinkText}
      </Text>
      <Text>{body}</Text>
    </PageTemplate>
  );
};

const sx = {
  layout: {
    marginBottom: "spacer3",
    ".contentFlex": {
      maxWidth: "35rem",
    },
  },
  heading: {
    gap: "12px",
    marginBottom: "spacer2",
    alignItems: "center",
  },
  warningIcon: {
    boxSize: "2rem",
    ".mobile &": {
      boxSize: "1.5rem",
    },
  },
  headerText: {
    fontSize: "4xl",
    fontWeight: "normal",
    ".mobile &": {
      fontSize: "2xl",
    },
  },
  subHeadingText: {
    fontSize: "lg",
    fontWeight: "bold",
    marginBottom: "spacer2",
    ".mobile &": {
      marginBottom: "spacer3",
    },
  },
  descriptionText: {
    fontSize: "md",
  },
};
