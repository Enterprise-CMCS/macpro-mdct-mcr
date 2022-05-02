/* eslint-disable */
// components
import {
  Button,
  Flex,
  Icon as ChakraIcon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { DueDateDropdown, DueDateTable } from "../../components/index";
// utils
import { useBreakpoint } from "../../utils/useBreakpoint";
// assets
import { BsFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { HiDownload } from "react-icons/hi";
import MCPARCardText from "./data/MCPARCardText.json";

const templateTextMap: { [templateName: string]: any } = {
  MCPAR: MCPARCardText,
  MLR: {},
  ASR: {},
};

export const TemplateCard = ({ templateName }: Props) => {
  const { isTablet, isDesktop } = useBreakpoint();
  const cardTextValues = templateTextMap[templateName];

  const getTemplateSize = (templateName: string) => {
    // fetch file size from local or s3 for display
    console.log("Searching S3 for %s template size", templateName); // eslint-disable-line
    return "1.2MB";
  };
  return (
    <Stack
      textAlign="left"
      py={6}
      color={"palette.gray"}
      justify="center"
      maxW="46rem"
      boxShadow="0px 3px 9px rgba(0, 0, 0, 0.2)"
      direction="row"
      data-testid="template-download-card"
      flex="1"
      // sx={sx.downloadCardStack}
    >
      {isDesktop && (
        <Flex sx={sx.spreadsheetIconFlex} justify="center" width="9.5rem">
          <ChakraIcon
            as={BsFileEarmarkSpreadsheetFill}
            sx={sx.spreadsheetIcon}
            boxSize="5.5rem"
          />
        </Flex>
      )}
      <Flex sx={sx.cardContentFlex} flexDirection="column" gap="0.5rem">
        <Text
          sx={sx.templateNameText}
          fontSize={"lg"}
          fontWeight={"bold"}
          color={"palette.gray_darkest"}
          rounded={"full"}
        >
          {cardTextValues.title}
        </Text>
        {!isDesktop && (
          <Text
            fontSize={"md"}
            fontWeight={"normal"}
            color={"palette.gray_darkest"}
          >
            {cardTextValues.dueDateText}
          </Text>
        )}
        <Text
          sx={sx.templateDescriptionText}
          fontSize={"md"}
          fontWeight={"normal"}
          color={"palette.gray_darkest"}
          width="33.5rem"
        >
          {cardTextValues.templateDescriptionText}
          {isDesktop ? cardTextValues.additionalDescriptionText : ""}
        </Text>
        <Button
          sx={sx.templateDownloadButton}
          leftIcon={<ChakraIcon as={HiDownload} boxSize="1.5rem" />}
          borderRadius="0.25rem"
          color={"palette.white"}
          bg={"palette.main"}
          width="18.5rem"
          fontWeight={"bold"}
          _hover={{ bg: "palette.main_darker" }}
          rightIcon={
            <Text as="sub" fontSize="0.75rem" fontWeight={"semibold"}>
              {getTemplateSize("MCPAR")}
            </Text>
          }
        >
          {cardTextValues.downloadText}
        </Button>
        {isTablet && (
          <Flex flexDirection={"column"}>
            <Text
              sx={sx.templateNameText}
              fontSize={"lg"}
              fontWeight={"bold"}
              color={"palette.gray_darkest"}
              rounded={"full"}
              marginTop="3rem"
            >
              {templateName} Due Dates
            </Text>
            <Text
              sx={sx.templateDescriptionText}
              fontSize={"md"}
              fontWeight={"normal"}
              color={"palette.gray_darkest"}
              width="33.5rem"
              marginBottom="1rem"
            >
              {cardTextValues.tableDescriptionText}
            </Text>
          </Flex>
        )}
        {isDesktop ? (
          <DueDateDropdown templateName={templateName}></DueDateDropdown>
        ) : (
          <DueDateTable templateName={templateName} />
        )}
      </Flex>
    </Stack>
  );
};

interface Props {
  templateName: string;
}

const sx = {
  downloadCardStack: {
    // textAlign: "left",
    // py: 6,
    // color: "palette.gray",
    // align: "left",
    // width: "46rem",
    // boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    // direction: "row",
  },
  spreadsheetIconFlex: {
    // justify: "center",
    // width: "9.5rem",
  },
  spreadsheetIcon: {
    // boxSize: "5.5rem",
  },
  cardContentFlex: {
    // flexDirection: "column",
    // gap: "0.5rem",
  },
  templateNameText: {
    // fontSize: "lg",
    // fontWeight: "bold",
    // color: "palette.gray_darkest",
    // rounded: "full",
  },
  templateFileStack: {
    // direction: "row",
    // align: "center",
  },
  templateDescriptionText: {
    // fontSize: "md",
    // fontWeight: "normal",
    // color: "palette.gray_darkest",
    // width: "33.5rem",
  },
  templateDownloadButton: {
    // borderRadius: "0.25rem",
    // color: "palette.white",
    // bg: "palette.main",
    // width: "18.5rem",
    // fontWeight: "bold",
    // _hover: {
    //   bg: "palette.main_darker",
    // },
  },
};
