// components
import { Flex, Image, Link, Text } from "@chakra-ui/react";
import { Card } from "../index";
// utils
import {
  makeMediaQueryClasses,
  useBreakpoint,
} from "../../utils/useBreakpoint";
import { JsonObject } from "utils/types/types";
// assets
import spreadsheetIcon from "../../assets/images/icon_spreadsheet.png";
import settingsIcon from "../../assets/images/icon_wrench-gear.png";

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

export const createEmailLink = (emailData: {
  [key: string]: string;
}): string => {
  const { address, subject, body } = emailData;
  return `mailto:${address}?${encodeURIComponent(subject)}&${encodeURIComponent(
    body
  )}`;
};

export const FaqCard = ({ verbiage, icon, cardprops, ...props }: Props) => {
  const { isDesktop } = useBreakpoint();
  const mqClasses = makeMediaQueryClasses();

  return (
    <Card {...cardprops}>
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
            <Link
              href={createEmailLink(verbiage.email)}
              target="_blank"
              data-testid="get-help-link"
            >
              {verbiage.email.address}
            </Link>
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

interface Props {
  verbiage: JsonObject;
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
    boxSize: "5.5rem",
    "&.mobile": {
      alignSelf: "center",
      marginRight: "0",
      marginBottom: "1rem",
    },
  },
  cardContentFlex: {
    width: "100%",
    flexDirection: "column",
  },
  bodyText: {
    marginBottom: "1rem",
  },
  emailText: {
    fontWeight: "bold",
  },
};
