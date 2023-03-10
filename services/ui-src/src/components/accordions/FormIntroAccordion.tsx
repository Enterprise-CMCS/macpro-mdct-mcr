// components
import { Accordion, Box, ListItem, UnorderedList } from "@chakra-ui/react";
import { AccordionItem } from "components";
// types
import { AnyObject } from "types";
// utils
import { sanitizeAndParseHtml } from "utils";

export const FormIntroAccordion = ({ verbiage, ...props }: Props) => {
  const { buttonLabel, intro, list, text } = verbiage;
  return (
    <Accordion allowToggle={true} allowMultiple={true} {...props}>
      <AccordionItem label={buttonLabel} sx={sx.item}>
        <Box sx={sx.answerBox}>{sanitizeAndParseHtml(intro)}</Box>
        <UnorderedList sx={sx.list}>
          {list.map((listItem: string, index: number) => (
            <ListItem key={index}>{sanitizeAndParseHtml(listItem)}</ListItem>
          ))}
        </UnorderedList>
        <Box sx={sx.answerBox}>{sanitizeAndParseHtml(text)}</Box>
      </AccordionItem>
    </Accordion>
  );
};

interface Props {
  verbiage: AnyObject;
  [key: string]: any;
}

const sx = {
  root: {
    marginTop: "2rem",
  },
  item: {
    marginBottom: "1.5rem",
    borderStyle: "none",
  },
  answerBox: {
    ".mobile &": {
      paddingLeft: "1rem",
    },
  },
  text: {
    marginBottom: "1rem",
  },
  table: {
    "tr td:last-of-type": {
      fontWeight: "semibold",
    },
  },
  list: {
    paddingLeft: "1rem",
    "li:last-of-type": {
      fontWeight: "bold",
    },
  },
};
