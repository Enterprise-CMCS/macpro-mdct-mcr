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

const templateTextMap: { [templateName: string]: any } = {
  MCPAR: MCPARCardText,
  MLR: MLRCardText,
  NAAAR: NAAARCardText,
};

export const TemplateCard = ({ templateName }: Props) => {
  const { isDesktop } = useBreakpoint();
  const cardTextValues = templateTextMap[templateName];

  const getTemplateSize = (templateName: string) => {
    // TODO fetch file size from local or s3 for display
    console.log("Searching S3 for %s template size", templateName); // eslint-disable-line
    return "1.2MB";
  };
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
          rightIcon={
            <Text sx={sx.fileSizeText} as="sub">
              {getTemplateSize(templateName)}
            </Text>
          }
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
  },
  spreadsheetIcon: {
    boxSize: "5.5rem",
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
    maxW: "18.5rem",
    fontWeight: "bold",
    _hover: {
      background: "palette.main_darker",
    },
  },
  fileSizeText: {
    fontWeight: "semibold",
  },
};
