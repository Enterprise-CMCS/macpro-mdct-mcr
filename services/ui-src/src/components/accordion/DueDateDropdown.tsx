// components
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Icon as ChakraIcon,
} from "@chakra-ui/react";
import { DueDateTable } from "../index";
// assets
import { BsPlus } from "react-icons/bs";
import { FiMinus } from "react-icons/fi";

export const DueDateDropdown = ({ templateName }: Props) => {
  return (
    <Accordion
      allowToggle={true}
      width="33.5rem"
      marginTop="3rem"
      data-testid="due-date-accordion"
    >
      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <h2>
              <AccordionButton bg={"palette.gray_lightest"} height="3.5rem">
                <Box
                  flex="1"
                  textAlign="left"
                  fontSize={"md"}
                  fontWeight={"normal"}
                  color={"palette.gray_darkest"}
                >
                  When is the MCPAR due?
                </Box>
                {isExpanded ? (
                  <ChakraIcon as={FiMinus} boxSize="1.5rem" />
                ) : (
                  <ChakraIcon as={BsPlus} boxSize="2rem" />
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
