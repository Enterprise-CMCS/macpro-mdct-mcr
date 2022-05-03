// components
import {
  Box,
  Button,
  Flex,
  Icon as ChakraIcon,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { DueDateDropdown } from "../../components/index";
// utils
import {
  makeMediaQueryClasses,
  useBreakpoint,
} from "../../utils/useBreakpoint";
// assets
import { HiDownload } from "react-icons/hi";
import MCPARCardText from "./data/MCPARCardText.json";
import SpreadsheetIcon from "../../assets/icon_spreadsheet.png";

const templateTextMap: { [templateName: string]: any } = {
  MCPAR: MCPARCardText,
  MLR: {},
  ASR: {},
};

export const TemplateCard = ({ templateName }: Props) => {
  const { isTablet, isDesktop } = useBreakpoint();
  const mqClasses = makeMediaQueryClasses();
  const cardTextValues = templateTextMap[templateName];

  const getTemplateSize = (templateName: string) => {
    // TODO fetch file size from local or s3 for display
    console.log("Searching S3 for %s template size", templateName); // eslint-disable-line
    return "1.2MB";
  };
  return (
    <Stack
      sx={sx.root}
      className={mqClasses}
      data-testid="template-download-card"
    >
      {isDesktop && (
        <Box sx={sx.spreadsheetIconBox}>
          <Image
            src={SpreadsheetIcon}
            alt="Spreadsheet icon"
            sx={sx.spreadsheetIcon}
          />
        </Box>
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
          leftIcon={<ChakraIcon as={HiDownload} boxSize="1.5rem" />}
          rightIcon={
            <Text sx={sx.fileSizeText} as="sub">
              {getTemplateSize("MCPAR")}
            </Text>
          }
        >
          {cardTextValues.downloadText}
        </Button>
        {isTablet && (
          <Flex sx={sx.tabletAdditionalTextFlex}>
            <Text sx={sx.tabletDueDateText}>{templateName} Due Dates</Text>
            <Text sx={sx.tabletDescriptionText}>
              {cardTextValues.tableDescriptionText}
            </Text>
          </Flex>
        )}
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
  spreadsheetIconBox: {
    width: "9.5rem",
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
  tabletDueDateText: {
    fontSize: "lg",
    fontWeight: "bold",
    color: "palette.gray_darkest",
    marginTop: "1rem",
  },
  tabletDescriptionText: {
    fontSize: "md",
    fontWeight: "normal",
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
  tabletAdditionalTextFlex: {
    flexDirection: "column",
  },
};
