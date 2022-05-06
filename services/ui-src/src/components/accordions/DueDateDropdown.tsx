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
// utils
import { makeMediaQueryClasses } from "../../utils/useBreakpoint";
import { JsonObject } from "utils/types/types";

export const DueDateDropdown = ({ verbiage }: Props) => {
  const mqClasses = makeMediaQueryClasses();

  return (
    <Accordion sx={sx.root} allowToggle={true} data-testid="due-date-accordion">
      <AccordionItem sx={sx.accordionItem}>
        {({ isExpanded }) => (
          <>
            <div>
              <AccordionButton sx={sx.accordionButton}>
                <Box flex="1" sx={sx.accordionButtonLabel}>
                  {verbiage.buttonLabel}
                </Box>
                {isExpanded ? (
                  <Icon icon="minus" boxSize="1.5rem"></Icon>
                ) : (
                  <Icon icon="plus" boxSize="2rem"></Icon>
                )}
              </AccordionButton>
            </div>
            <AccordionPanel sx={sx.accordionPanel} className={mqClasses}>
              <Flex sx={sx.accordionPanelFlex}>
                <Text sx={sx.accordionBodyTitle}>{verbiage.bodyTitle}</Text>
                <Text sx={sx.accordionBodyText}>{verbiage.bodyText}</Text>
                {verbiage.table && <DueDateTable verbiage={verbiage.table} />}
                {verbiage.list && (
                  <UnorderedList>
                    {verbiage.list.map((item: string, index: number) => (
                      <ListItem key={index}>{item}</ListItem>
                    ))}
                  </UnorderedList>
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
  verbiage: JsonObject;
}

const sx = {
  root: {
    marginTop: "2rem",
  },
  accordionItem: {
    borderStyle: "none",
  },
  accordionButton: {
    bg: "palette.gray_lightest",
    height: "3.5rem",
  },
  accordionButtonLabel: {
    textAlign: "left",
  },
  accordionPanel: {
    "&.mobile": {
      paddingLeft: "0",
      paddingRight: "0",
    },
  },
  accordionPanelFlex: {
    flexDirection: "column",
  },
  accordionBodyTitle: {
    fontSize: "lg",
    fontWeight: "bold",
    color: "palette.gray_darkest",
    marginTop: "1rem",
  },
  accordionBodyText: {
    fontSize: "md",
    fontWeight: "normal",
    color: "palette.gray_darkest",
    marginBottom: "1rem",
  },
};
