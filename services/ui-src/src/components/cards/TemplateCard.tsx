// components
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { Card, Icon, TemplateCardAccordion } from "../index";
// utils
import {
  makeMediaQueryClasses,
  useBreakpoint,
} from "../../utils/useBreakpoint";
import { JsonObject } from "utils/types/types";
// assets
import spreadsheetIcon from "../../assets/images/icon_spreadsheet.png";
import temporaryExcelTemplate from "../../assets/templates/MCPARDummy.xls";

const downloadTemplate = () => {
  const link = document.createElement("a");
  link.setAttribute("target", "_blank");
  link.setAttribute("href", temporaryExcelTemplate);
  link.setAttribute("download", `Dummy.xls`);
  link.click();
  link.remove();
};

export const TemplateCard = ({ verbiage, cardprops, ...props }: Props) => {
  const { isDesktop } = useBreakpoint();
  const mqClasses = makeMediaQueryClasses();

  return (
    <Card {...cardprops}>
      <Flex sx={sx.root} className={mqClasses} {...props}>
        {isDesktop && (
          <Image
            src={spreadsheetIcon}
            alt="Spreadsheet icon"
            sx={sx.spreadsheetIcon}
          />
        )}
        <Flex sx={sx.cardContentFlex}>
          <Text sx={sx.cardTitleText}>{verbiage.title}</Text>
          {!isDesktop && <Text>{verbiage.dueDate}</Text>}
          <Text>{verbiage.body}</Text>
          {isDesktop && verbiage.note && <Text>{verbiage.note}</Text>}
          <Button
            sx={sx.templateDownloadButton}
            leftIcon={<Icon icon="downloadArrow" boxSize="1.5rem" />}
            onClick={downloadTemplate}
            data-testid="template-download-button"
          >
            Download Excel Template
          </Button>
          <TemplateCardAccordion verbiage={verbiage.accordion} />
        </Flex>
      </Flex>
    </Card>
  );
};

interface Props {
  verbiage: JsonObject;
  [key: string]: any;
}

const sx = {
  root: {
    flexDirection: "row",
  },
  spreadsheetIcon: {
    marginTop: "0.675rem",
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
    maxW: "16.5rem",
    justifyContent: "start",
    marginTop: "1rem",
    borderRadius: "0.25rem",
    background: "palette.main",
    fontWeight: "bold",
    color: "palette.white",
    span: {
      margin: "0rem",
    },
    _hover: {
      background: "palette.main_darker",
    },
  },
};
