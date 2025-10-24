// components
import { Flex, Image, Link, Text } from "@chakra-ui/react";
import { Card } from "components";
// types
import { AnyObject } from "types";
// utils
import { useBreakpoint } from "utils";
import { createEmailLink } from "utils/other/email";
// assets
import spreadsheetIcon from "assets/icons/icon_spreadsheet.png";
import settingsIcon from "assets/icons/icon_wrench_gear.png";

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

  return (
    <Card {...cardprops} paddingBottom="1.5rem !important">
      <Flex sx={sx.root} {...props}>
        <Image src={iconMap[icon].image} alt={iconMap[icon].alt} sx={sx.icon} />
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
    ".mobile &": {
      flexDirection: "column",
    },
  },
  icon: {
    marginRight: "spacer4",
    boxSize: "78px",
    ".mobile &": {
      alignSelf: "center",
      marginRight: "0",
      marginBottom: "spacer2",
    },
  },
  cardContentFlex: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
  },
  bodyText: {
    marginBottom: "spacer2",
  },
  emailText: {
    fontWeight: "bold",
  },
};
