// components
import { Flex, Heading, Image, Link, Text } from "@chakra-ui/react";
import { PageTemplate } from "components";
// utils
import { createEmailLink } from "utils/other/email";
import { makeMediaQueryClasses } from "utils";
// assets
import warningIcon from "assets/icons/icon_warning.png";
import verbiage from "verbiage/pages/not-found";

export const NotFoundPage = () => {
  const mqClasses = makeMediaQueryClasses();
  const { header, subHeading, emailText, body } = verbiage;
  const { preLinkText, cmsEmail, postLinkText } = emailText;

  return (
    <PageTemplate data-testid="404-view" sxOverride={sx.layout}>
      <Flex sx={sx.heading}>
        <Image
          src={warningIcon}
          alt="warning icon"
          sx={sx.warningIcon}
          className={mqClasses}
        />
        <Heading as="h1" sx={sx.headerText} className={mqClasses}>
          {header}
        </Heading>
      </Flex>
      <Heading as="h2" sx={sx.subHeadingText} className={mqClasses}>
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
    marginBottom: "1.5rem",
    ".contentFlex": {
      maxWidth: "35rem",
    },
  },
  heading: {
    gap: "12px",
    marginBottom: "1rem",
    alignItems: "center",
  },
  warningIcon: {
    boxSize: "2rem",
    "&.mobile": {
      boxSize: "1.5rem",
    },
  },
  headerText: {
    fontSize: "4xl",
    fontWeight: "normal",
    "&.mobile": {
      fontSize: "2xl",
    },
  },
  subHeadingText: {
    fontSize: "lg",
    fontWeight: "bold",
    marginBottom: "1rem",
    "&.mobile": {
      marginBottom: "1.5rem",
    },
  },
  descriptionText: {
    fontSize: "md",
  },
};
