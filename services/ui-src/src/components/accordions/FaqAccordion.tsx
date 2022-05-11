// components
import { Accordion, Box, Text } from "@chakra-ui/react";
import { AccordionItem } from "../index";
// utils
import { JsonObject } from "utils/types/types";

export const FaqAccordion = ({ accordionItems }: Props) => (
  <Accordion allowToggle={true} data-testid="faq-accordion">
    {accordionItems.map((item: JsonObject, index: number) => (
      <AccordionItem key={index} label={item.question} sx={sx.item}>
        <Box sx={sx.answerBox}>
          <Text>{item.answer}</Text>
        </Box>
      </AccordionItem>
    ))}
  </Accordion>
);

interface Props {
  accordionItems: JsonObject;
}

const sx = {
  item: {
    marginBottom: "1.5rem",
    borderStyle: "none",
  },
  answerBox: {
    paddingLeft: "1rem",
  },
};
