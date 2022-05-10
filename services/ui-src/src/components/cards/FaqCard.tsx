// components
import { Flex, Image, Link, Text } from "@chakra-ui/react";
import { Card } from "../index";
// utils
import {
  makeMediaQueryClasses,
  // useBreakpoint,
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

const createEmailDestination = (emailData: {
  [key: string]: string;
}): string => {
  const { address, subject, body } = emailData;
  return `${address}?${encodeURIComponent(subject)}&${encodeURIComponent(
    body
  )}`;
};

export const FaqCard = ({ verbiage, icon, cardprops, ...props }: Props) => {
  // const { isDesktop } = useBreakpoint();
  const mqClasses = makeMediaQueryClasses();

  return (
    <Card {...cardprops}>
      <Flex sx={sx.root} className={mqClasses} {...props}>
        <Image src={iconMap[icon].image} alt={iconMap[icon].alt} sx={sx.icon} />
        <Flex sx={sx.cardContentFlex}>
          <Text sx={sx.bodyText}>{verbiage.body}</Text>
          <Text sx={sx.emailText}>
            Email{" "}
            <Link
              href={`mailto:${createEmailDestination(verbiage.email)}`}
              target="_blank"
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
    marginBottom: "2rem",
    textAlign: "left",
  },
  icon: {
    marginRight: "2rem",
    boxSize: "5.5rem",
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
