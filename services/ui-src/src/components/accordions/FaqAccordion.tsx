// components
import { Accordion, Box, Text } from "@chakra-ui/react";
import { AccordionItem } from "../index";
// utils
import { makeMediaQueryClasses } from "../../utils/useBreakpoint";
import { JsonObject } from "utils/types/types";

export const FaqAccordion = ({ accordionItems, ...props }: Props) => {
  const mqClasses = makeMediaQueryClasses();

  return (
    <Accordion allowToggle={true} allowMultiple={true} {...props}>
      {accordionItems.map((item: JsonObject, index: number) => (
        <AccordionItem key={index} label={item.question} sx={sx.item}>
          <Box sx={sx.answerBox} className={mqClasses}>
            <Text>{item.answer}</Text>
          </Box>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

interface Props {
  accordionItems: JsonObject;
  [key: string]: any;
}

const sx = {
  item: {
    marginBottom: "1.5rem",
    borderStyle: "none",
  },
  answerBox: {
    "&.mobile": {
      paddingLeft: "1rem",
    },
  },
};
