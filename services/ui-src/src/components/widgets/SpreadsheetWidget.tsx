import React from "react";
// components
import { Box, Flex, Image, Text } from "@chakra-ui/react";
// assets
import greenSpreadsheetIcon from "../../assets/icons/icon_spreadsheet_green.png";

export const SpreadsheetWidget = ({
  description,
  isPdf,
  reportType,
  ...props
}: Props) => {
  return (
    <Box {...props}>
      <Flex sx={sx.container}>
        <Flex sx={sx.iconContainer}>
          <Image
            src={greenSpreadsheetIcon}
            alt={!isPdf ? "Excel Workbook Icon" : undefined}
            role={isPdf ? "none" : "img"}
            sx={sx.icon}
          />
        </Flex>
        <Box>
          <Text sx={sx.title}>
            Find in the Excel {reportType === "MLR" ? "Reference" : "Workbook"}
          </Text>
          <Box>
            <Text sx={sx.description}>{description}</Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

interface Props {
  description: string;
  isPdf?: boolean;
  reportType?: string;
  [key: string]: any;
}

const sx = {
  container: {
    paddingLeft: "1rem",
    borderLeft: "4px solid",
    borderColor: "palette.spreadsheet",
  },
  iconContainer: {
    maxWidth: "3rem",
    maxHeight: "3rem",
    marginRight: "1rem",
  },
  icon: {
    maxWidth: "2.5rem",
    maxHeight: "2.5rem",
    margin: "auto",
  },
  title: {
    color: "palette.spreadsheet_dark",
  },
  description: {
    fontWeight: "bold",
    color: "palette.spreadsheet_dark",
  },
};
