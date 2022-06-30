// components
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { Card, Icon, TemplateCardAccordion } from "../index";
// utils
import {
  makeMediaQueryClasses,
  useBreakpoint,
} from "../../utils/useBreakpoint";
import { JsonObject } from "utils/types/types";
import { getSignedTemplateUrl } from "utils/api/index";
// assets
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
  const mqClasses = makeMediaQueryClasses();

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
          <Text sx={sx.cardTitleText}>{verbiage.title}</Text>
          <Text>{verbiage.body}</Text>
          <Button
            className={mqClasses}
            sx={sx.templateDownloadButton}
            leftIcon={<Icon icon="downloadArrow" boxSize="1.5rem" />}
            isDisabled={isDisabled}
            onClick={async () => {
              await downloadTemplate(templateName);
            }}
          >
            {verbiage.buttonText}
          </Button>
          <TemplateCardAccordion verbiage={verbiage.accordion} />
        </Flex>
      </Flex>
    </Card>
  );
};

interface Props {
  templateName: string;
  verbiage: JsonObject;
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
  },
  templateDownloadButton: {
    justifyContent: "start",
    marginTop: "1rem",
    borderRadius: "0.25rem",
    background: "palette.main",
    fontWeight: "bold",
    color: "palette.white",
    span: {
      marginLeft: "-0.25rem",
      marginRight: "0.25rem",
    },
    _hover: {
      background: "palette.main_darker",
    },
    "&.mobile": {
      fontSize: "sm",
    },
  },
};
