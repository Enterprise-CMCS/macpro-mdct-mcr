// components
import { Accordion, Box } from "@chakra-ui/react";
import { AccordionItem } from "components";
// types
import { FaqItem } from "types";
// utils
import { parseCustomHtml } from "utils";

export const FaqAccordion = ({ accordionItems, ...props }: Props) => {
  return (
    <Accordion allowMultiple={true} {...props}>
      {accordionItems.map((item: FaqItem, index: number) => (
        <AccordionItem key={index} label={item.question} sx={sx.item}>
          <Box sx={sx.answerBox}>{parseCustomHtml(item.answer)}</Box>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

interface Props {
  accordionItems: FaqItem[];
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
