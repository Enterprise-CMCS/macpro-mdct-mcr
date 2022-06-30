// components
import { Flex, Image, Link, Text } from "@chakra-ui/react";
import { Card } from "components";
// utils
import { makeMediaQueryClasses, useBreakpoint } from "utils";
import { AnyObject } from "types";
import { createEmailLink } from "utils/other/email";
// assets
import spreadsheetIcon from "assets/images/icons/icon_spreadsheet.png";
import settingsIcon from "assets/images/icons/icon_wrench-gear.png";

const iconMap: { [key: string]: { [key: string]: string } } = {
  spreadsheet: {
    image: spreadsheetIcon,
    alt: "spreadsheet icon",
  },
  settings: {
    image: settingsIcon,
    alt: "settings icon",
  },
};

export const EmailCard = ({ verbiage, icon, cardprops, ...props }: Props) => {
  const { isDesktop } = useBreakpoint();
  const mqClasses = makeMediaQueryClasses();

  return (
    <Card {...cardprops} paddingBottom="1.5rem !important">
      <Flex sx={sx.root} {...props} className={mqClasses}>
        <Image
          src={iconMap[icon].image}
          alt={iconMap[icon].alt}
          sx={sx.icon}
          className={mqClasses}
        />
        <Flex sx={sx.cardContentFlex}>
          <Text sx={sx.bodyText}>{verbiage.body}</Text>
          <Text sx={sx.emailText}>
            Email {!isDesktop && <br />}
            <Link href={createEmailLink(verbiage.email)} target="_blank">
              {verbiage.email.address}
            </Link>
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

interface Props {
  verbiage: AnyObject;
  icon: string;
  [key: string]: any;
}

const sx = {
  root: {
    flexDirection: "row",
    textAlign: "left",
    "&.mobile": {
      flexDirection: "column",
    },
  },
  icon: {
    marginRight: "2rem",
    boxSize: "78px",
    "&.mobile": {
      alignSelf: "center",
      marginRight: "0",
      marginBottom: "1rem",
    },
  },
  cardContentFlex: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
  },
  bodyText: {
    marginBottom: "1rem",
  },
  emailText: {
    fontWeight: "bold",
  },
};
