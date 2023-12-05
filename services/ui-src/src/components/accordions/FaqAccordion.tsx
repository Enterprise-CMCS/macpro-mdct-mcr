// components
import { Accordion, Box, Text } from "@chakra-ui/react";
import { AccordionItem } from "components";
// types
import { AnyObject } from "types";
// utils
import { parseCustomHtml } from "utils";

export const FaqAccordion = ({ accordionItems, ...props }: Props) => {
  return (
    <Accordion allowToggle={true} allowMultiple={true} {...props}>
      {accordionItems.map((item: AnyObject, index: number) => (
        <AccordionItem key={index} label={item.header} sx={sx.item}>
          <Box sx={sx.answerBox}>
            <Text>{parseCustomHtml(item.body)}</Text>
          </Box>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

interface Props {
  accordionItems: AnyObject;
  [key: string]: any;
}

const sx = {
  item: {
    marginBottom: "1.5rem",
    borderStyle: "none",
  },
  answerBox: {
    ".mobile &": {
      paddingLeft: "1rem",
    },
  },
};
