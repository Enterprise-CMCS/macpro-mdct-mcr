// components
import { Button, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { DueDateDropdown, Icon } from "../index";
// utils
import {
  makeMediaQueryClasses,
  useBreakpoint,
} from "../../utils/useBreakpoint";
import { JsonObject } from "utils/types/types";
// assets
import SpreadsheetIcon from "../../assets/icon_spreadsheet.png";
import MCPARSpreadsheet from "./templates/MCPARDummy.xls";

const downloadTemplate = () => {
  const link = document.createElement("a");
  link.setAttribute("target", "_blank");
  link.setAttribute("href", MCPARSpreadsheet);
  link.setAttribute("download", `Dummy.xls`);
  link.click();
  link.remove();
};

export const TemplateCard = ({ verbiage }: Props) => {
  const { isDesktop } = useBreakpoint();
  const mqClasses = makeMediaQueryClasses();

  return (
    <Stack
      sx={sx.root}
      className={mqClasses}
      data-testid="template-download-card"
    >
      {isDesktop && (
        <Image
          src={SpreadsheetIcon}
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
          leftIcon={<Icon icon="downloadArrow" boxSize="1.5rem"></Icon>}
          onClick={downloadTemplate}
          data-testid="template-download-button"
        >
          Download Excel Template
        </Button>
        <DueDateDropdown verbiage={verbiage.accordion}></DueDateDropdown>
      </Flex>
    </Stack>
  );
};

interface Props {
  verbiage: JsonObject;
}

const sx = {
  root: {
    textAlign: "left",
    padding: "2rem",
    boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    flexDirection: "row",
    marginBottom: "2rem",
    width: "100%",
    "&.mobile": {
      padding: "1rem",
    },
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
  cardTitleText: {
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
