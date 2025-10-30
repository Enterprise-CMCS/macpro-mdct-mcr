import { useNavigate } from "react-router-dom";
// components
import { Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { Card, TemplateCardAccordion } from "components";
// types
import { AnyObject, TemplateKeys } from "types";
// utils
import { useBreakpoint } from "utils";
// assets
import downloadIcon from "assets/icons/icon_download.png";
import nextIcon from "assets/icons/icon_next_white.png";
import spreadsheetIcon from "assets/icons/icon_spreadsheet.png";

const downloadTemplate = (templateName: string) => {
  const link = document.createElement("a");
  link.setAttribute("target", "_blank");
  link.setAttribute("href", TemplateKeys[templateName]);
  link.click();
  link.remove();
};

export const TemplateCard = ({
  templateName,
  verbiage,
  cardprops,
  isDisabled,
  ...props
}: Props) => {
  const { isDesktop } = useBreakpoint();
  const navigate = useNavigate();

  const cardText = verbiage.body?.available;

  return (
    <Card {...cardprops}>
      <Flex sx={sx.root} {...props}>
        {isDesktop && (
          <Image
            src={spreadsheetIcon}
            alt="Spreadsheet icon"
            sx={sx.spreadsheetIcon}
          />
        )}
        <Flex sx={sx.cardContentFlex}>
          <Heading sx={sx.cardTitleText}>{verbiage.title}</Heading>
          <Text>{cardText}</Text>
          <Flex sx={sx.actionsFlex}>
            <Button
              variant="link"
              sx={sx.templateDownloadButton}
              leftIcon={
                <Image src={downloadIcon} alt="Download Icon" height="1.5rem" />
              }
              onClick={async () => {
                await downloadTemplate(templateName);
              }}
            >
              {verbiage.downloadText}
            </Button>
            <Button
              sx={sx.formLink}
              isDisabled={isDisabled}
              onClick={() => navigate(verbiage.link.route)}
              rightIcon={<Image src={nextIcon} alt="Link Icon" height="1rem" />}
            >
              {verbiage.link.text}
            </Button>
          </Flex>
          <TemplateCardAccordion verbiage={verbiage.accordion} />
        </Flex>
      </Flex>
    </Card>
  );
};

interface Props {
  templateName: string;
  verbiage: AnyObject;
  isDisabled?: boolean;
  [key: string]: any;
}

const sx = {
  root: {
    flexDirection: "row",
  },
  spreadsheetIcon: {
    marginRight: "spacer4",
    boxSize: "5.5rem",
  },
  cardContentFlex: {
    width: "100%",
    flexDirection: "column",
  },
  cardTitleText: {
    marginBottom: "spacer1",
    fontSize: "lg",
    fontWeight: "bold",
    lineHeight: "1.5",
  },
  actionsFlex: {
    flexFlow: "wrap",
    gridGap: "spacer2",
    justifyContent: "space-between",
    marginTop: "spacer2",
    ".mobile &": {
      flexDirection: "column",
    },
  },
  templateDownloadButton: {
    justifyContent: "start",
    marginRight: "spacer2",
    padding: "0",
    span: {
      marginLeft: "0rem",
      marginRight: "spacer1",
    },
    ".mobile &": {
      marginRight: "0",
    },
  },
  formLink: {
    justifyContent: "start",
    span: {
      marginLeft: "spacer1",
      marginRight: "-0.25rem",
    },
  },
};
