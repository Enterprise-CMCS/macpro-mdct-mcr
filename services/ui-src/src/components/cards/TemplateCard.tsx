// components
import { Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { Card, TemplateCardAccordion } from "components";
// utils
import { useNavigate } from "react-router-dom";
import config from "config";
import { getSignedTemplateUrl, useBreakpoint } from "utils";
import { AnyObject } from "types";
// assets
import downloadIcon from "assets/icons/icon_download.png";
import nextIcon from "assets/icons/icon_next.png";
import spreadsheetIcon from "assets/icons/icon_spreadsheet.png";

const downloadTemplate = async (templateName: string) => {
  const signedUrl = await getSignedTemplateUrl(templateName);
  const link = document.createElement("a");
  link.setAttribute("target", "_blank");
  link.setAttribute("href", signedUrl);
  link.click();
  link.remove();
};

export const TemplateCard = ({
  templateName,
  verbiage,
  cardprops,
  isDisabled = false,
  ...props
}: Props) => {
  const { isDesktop } = useBreakpoint();
  const navigate = useNavigate();

  const showFormLink = verbiage.link && config.STAGE !== "production";
  const cardText = showFormLink
    ? verbiage.body.available
    : verbiage.body.unavailable;
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
              isDisabled={isDisabled}
              onClick={async () => {
                await downloadTemplate(templateName);
              }}
            >
              {verbiage.downloadText}
            </Button>
            {showFormLink && (
              <Button
                sx={sx.formLink}
                onClick={() => navigate(verbiage.link.route)}
                data-testid="enter-mcpar-online"
                rightIcon={
                  <Image src={nextIcon} alt="Link Icon" height="1rem" />
                }
              >
                {verbiage.link.text}
              </Button>
            )}
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
    marginRight: "2rem",
    boxSize: "5.5rem",
  },
  cardContentFlex: {
    width: "100%",
    flexDirection: "column",
  },
  cardTitleText: {
    marginBottom: "0.5rem",
    fontSize: "lg",
    fontWeight: "bold",
    lineHeight: "1.5",
  },
  actionsFlex: {
    flexFlow: "wrap",
    gridGap: "1rem",
    justifyContent: "space-between",
    marginTop: "1rem",
    ".mobile &": {
      flexDirection: "column",
    },
  },
  templateDownloadButton: {
    justifyContent: "start",
    marginRight: "1rem",
    padding: "0",
    span: {
      marginLeft: "0rem",
      marginRight: "0.5rem",
    },
    ".mobile &": {
      marginRight: "0",
    },
  },
  formLink: {
    justifyContent: "start",
    span: {
      marginLeft: "0.5rem",
      marginRight: "-0.25rem",
    },
  },
};
