// components
import { Accordion, ListItem, OrderedList, Text } from "@chakra-ui/react";
import { AccordionItem } from "components";
// types
import { AnyObject } from "types";
import { parseCustomHtml } from "utils";

export const TemplateCardAccordion = ({ verbiage, ...props }: Props) => (
  <Accordion sx={sx.root} allowToggle={true} {...props}>
    <AccordionItem label={verbiage.buttonLabel}>
      {verbiage.text && (
        <Text sx={sx.text}>{parseCustomHtml(verbiage.text)}</Text>
      )}
      <Text sx={sx.text}>{verbiage.introText}</Text>
      {verbiage.orderedList?.length > 0 && (
        <OrderedList sx={sx.orderedList}>
          {verbiage.orderedList.map((item: string, index: number) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </OrderedList>
      )}
      {verbiage.followUpText && (
        <Text sx={sx.text}>{verbiage.followUpText}</Text>
      )}
    </AccordionItem>
  </Accordion>
);

interface Props {
  verbiage: AnyObject;
  [key: string]: any;
}

const sx = {
  root: {
    marginTop: "2rem",
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
      textDecoration: "underline",
    },
  },
  orderedList: {
    paddingLeft: "1rem",
    "& > li": {
      marginBottom: "0.75rem",
    },
    "& > li::marker": {
      fontWeight: "normal",
    },
  },
};
