import React from "react";
// components
import { Box, Flex, Image, Text } from "@chakra-ui/react";
// assets
import greenSpreadsheetIcon from "../../assets/icons/icon_spreadsheet_green.png";

export const SpreadsheetWidget = ({ description, alt, ...props }: Props) => {
  return (
    <Box {...props}>
      <Flex sx={sx.container}>
        <Flex sx={sx.iconContainer}>
          <Image
            src={greenSpreadsheetIcon}
            alt={alt ?? "Excel Workbook Icon"}
            sx={sx.icon}
          />
        </Flex>
        <Box>
          <Text sx={sx.title}>Find in the Excel Workbook</Text>
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
  alt?: string;
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
