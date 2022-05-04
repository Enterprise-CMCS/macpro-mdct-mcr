// components
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { DueDateTable, Icon } from "../index";
// assets
import MCPARDropdownText from "./data/MCPARDropdownText.json";
import MLRDropdownText from "./data/MLRDropdownText.json";
import NAAARDropDownText from "./data/NAAARDropdownText.json";

const templateTextMap: { [templateName: string]: any } = {
  MCPAR: MCPARDropdownText,
  MLR: MLRDropdownText,
  NAAAR: NAAARDropDownText,
};

export const DueDateDropdown = ({ templateName }: Props) => {
  const dropDownTextValues = templateTextMap[templateName];
  return (
    <Accordion sx={sx.root} allowToggle={true} data-testid="due-date-accordion">
      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <div>
              <AccordionButton sx={sx.accordionButton}>
                <Box flex="1" sx={sx.accordionText}>
                  {dropDownTextValues.accordionText}
                </Box>
                {isExpanded ? (
                  <Icon icon="minus" boxSize="1.5rem"></Icon>
                ) : (
                  <Icon icon="plus" boxSize="2rem"></Icon>
                )}
              </AccordionButton>
            </div>
            <AccordionPanel>
              <Flex sx={sx.accordionAdditionalTextFlex}>
                <Text sx={sx.accordionDueDateText}>
                  {templateName} Due Dates
                </Text>
                <Text sx={sx.accordionDescriptionText}>
                  {dropDownTextValues.accordionDescriptionText}
                </Text>
                {dropDownTextValues.hasTable ? (
                  <DueDateTable templateName={templateName} />
                ) : (
                  ""
                )}
                {dropDownTextValues.hasList ? (
                  <UnorderedList>
                    <ListItem>
                      {dropDownTextValues.accordionDescriptionTextBulletOne}
                    </ListItem>
                    <ListItem>
                      {dropDownTextValues.accordionDescriptionTextBulletTwo}
                    </ListItem>
                  </UnorderedList>
                ) : (
                  ""
                )}
              </Flex>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

interface Props {
  templateName: string;
}

const sx = {
  root: {
    marginTop: "2rem",
  },
  accordionButton: {
    bg: "palette.gray_lightest",
    height: "3.5rem",
  },
  accordionText: {
    textAlign: "left",
  },
  accordionAdditionalTextFlex: {
    flexDirection: "column",
    borderStyle: "none",
  },
  accordionDueDateText: {
    fontSize: "lg",
    fontWeight: "bold",
    color: "palette.gray_darkest",
    marginTop: "1rem",
  },
  accordionDescriptionText: {
    fontSize: "md",
    fontWeight: "normal",
    color: "palette.gray_darkest",
    marginBottom: "1rem",
  },
};
