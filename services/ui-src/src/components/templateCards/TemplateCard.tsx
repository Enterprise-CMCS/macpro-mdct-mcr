// components
import { Button, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { DueDateDropdown, Icon } from "../index";
// utils
import { useBreakpoint } from "../../utils/useBreakpoint";
// assets
import MCPARCardText from "./data/MCPARCardText.json";
import MLRCardText from "./data/MLRCardText.json";
import NAAARCardText from "./data/NAAARCardText.json";
import SpreadsheetIcon from "../../assets/icon_spreadsheet.png";
import MCPARSpreadsheet from "./templates/MCPARDummy.xls";

const templateTextMap: { [templateName: string]: any } = {
  MCPAR: MCPARCardText,
  MLR: MLRCardText,
  NAAAR: NAAARCardText,
};

const downloadTemplate = () => {
  const link = document.createElement("a");
  link.setAttribute("target", "_blank");
  link.setAttribute("href", MCPARSpreadsheet);
  link.setAttribute("download", `Dummy.xls`);
  link.click();
  link.remove();
};

export const TemplateCard = ({ templateName }: Props) => {
  const { isDesktop } = useBreakpoint();
  const cardTextValues = templateTextMap[templateName];

  return (
    <Stack sx={sx.root} data-testid="template-download-card">
      {isDesktop && (
        <Image
          src={SpreadsheetIcon}
          alt="Spreadsheet icon"
          sx={sx.spreadsheetIcon}
        />
      )}
      <Flex sx={sx.cardContentFlex}>
        <Text sx={sx.templateNameText}>{cardTextValues.title}</Text>
        {!isDesktop && <Text>{cardTextValues.dueDateText}</Text>}
        <Text>
          {cardTextValues.templateDescriptionText}
          {isDesktop ? cardTextValues.additionalDescriptionText : ""}
        </Text>
        <Button
          sx={sx.templateDownloadButton}
          leftIcon={<Icon icon="downloadArrow" boxSize="1.5rem"></Icon>}
          onClick={downloadTemplate}
          data-testid="template-download-button"
        >
          {cardTextValues.downloadText}
        </Button>
        <DueDateDropdown templateName={templateName}></DueDateDropdown>
      </Flex>
    </Stack>
  );
};

interface Props {
  templateName: string;
}

const sx = {
  root: {
    textAlign: "left",
    padding: "2rem",
    boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    flexDirection: "row",
    marginBottom: "2rem",
  },
  spreadsheetIcon: {
    boxSize: "5.5rem",
    marginRight: "2rem",
  },
  cardContentFlex: {
    flexDirection: "column",
    gap: "0.5rem",
    color: "palette.gray_darkest",
  },
  templateNameText: {
    fontSize: "lg",
    fontWeight: "bold",
    color: "palette.gray_darkest",
  },
  templateDownloadButton: {
    borderRadius: "0.25rem",
    color: "palette.white",
    background: "palette.main",
    maxW: "17.5rem",
    fontWeight: "bold",
    justifyContent: "left",
    _hover: {
      background: "palette.main_darker",
    },
  },
};
