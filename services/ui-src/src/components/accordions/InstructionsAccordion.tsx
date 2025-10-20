// components
import { Accordion, Box, ListItem, UnorderedList } from "@chakra-ui/react";
import { AccordionItem } from "components";
// types
import { AnyObject } from "types";
// utils
import { parseCustomHtml, sanitizeAndParseHtml } from "utils";

export const InstructionsAccordion = ({ verbiage, ...props }: Props) => {
  const { buttonLabel, intro, list, text } = verbiage;
  return (
    <Accordion allowToggle={true} allowMultiple={true} sx={sx.root} {...props}>
      <AccordionItem label={buttonLabel} sx={sx.item}>
        {intro && <Box sx={sx.textBox}>{parseCustomHtml(intro)}</Box>}
        {list?.length > 0 && (
          <UnorderedList sx={sx.list}>
            {list.map((listItem: string, index: number) => (
              <ListItem key={index}>{sanitizeAndParseHtml(listItem)}</ListItem>
            ))}
          </UnorderedList>
        )}
        {text && <Box sx={sx.textBox}>{parseCustomHtml(text)}</Box>}
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
  textBox: {
    ".mobile &": {
      paddingLeft: "1rem",
    },
    a: {
      color: "primary",
      textDecoration: "underline",
    },
    p: {
      margin: "1rem 0",
      "&:first-of-type": {
        marginTop: 0,
      },
    },
    li: {
      marginBottom: "1.25rem",
    },
    ".ordered-list-parentheses": {
      counterReset: "item",
      listStyleType: "none",
      marginLeft: "3rem",
      "> li": {
        counterIncrement: "item",
      },
      "> li::before": {
        content: '"(" counter(item) ") "',
      },
    },
    ".indented-list": {
      marginLeft: "3rem",
    },
    ".marker-normal > li::marker": {
      fontWeight: "normal",
    },
    "ol > li > ol": {
      listStyleType: "lower-roman",
      marginInlineStart: "2.75rem",
      marginTop: "1.25rem",
    },
  },
  list: {
    paddingLeft: "1rem",
    margin: "1.5rem",
    li: {
      marginBottom: "1.25rem",
    },
  },
};
