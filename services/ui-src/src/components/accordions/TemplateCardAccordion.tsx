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
import { Icon, Table } from "../index";
// utils
import { makeMediaQueryClasses } from "../../utils/useBreakpoint";
import { JsonObject } from "utils/types/types";

export const TemplateCardAccordion = ({ verbiage }: Props) => {
  const mqClasses = makeMediaQueryClasses();

  return (
    <Accordion
      sx={sx.root}
      allowToggle={true}
      data-testid="template-card-accordion"
    >
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
                <Text sx={sx.accordionBodyText}>{verbiage.bodyText}</Text>
                {verbiage.table && (
                  <Table
                    content={verbiage.table}
                    variant="striped"
                    lastCellsBold
                    dataTestId="template-card-accordion-table"
                  />
                )}
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
    height: "3.5rem",
    bg: "palette.gray_lightest",
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
  accordionBodyText: {
    marginTop: "1rem",
    marginBottom: "1rem",
    fontSize: "md",
    fontWeight: "normal",
    color: "palette.gray_darkest",
  },
};
