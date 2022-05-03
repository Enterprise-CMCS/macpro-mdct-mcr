// components
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import { DueDateTable, Icon } from "../index";

export const DueDateDropdown = ({ templateName }: Props) => {
  return (
    <Accordion
      sx={sx.accordion}
      allowToggle={true}
      data-testid="due-date-accordion"
    >
      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <h2>
              <AccordionButton sx={sx.accordionButton}>
                <Box flex="1" sx={sx.accordionText}>
                  When is the {templateName} due?
                </Box>
                {isExpanded ? (
                  <Icon icon="minus" boxSize="1.5rem"></Icon>
                ) : (
                  <Icon icon="plus" boxSize="2rem"></Icon>
                )}
              </AccordionButton>
            </h2>
            <AccordionPanel>
              <DueDateTable templateName={templateName} />
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
  accordion: {
    marginTop: "2rem",
  },
  accordionButton: {
    bg: "palette.gray_lightest",
    height: "3.5rem",
  },
  accordionText: {
    textAlign: "left",
  },
};
