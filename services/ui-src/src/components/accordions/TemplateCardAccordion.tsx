// components
import { Accordion, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { AccordionItem, Table } from "components";
// utils
import { AnyObject } from "types";

export const TemplateCardAccordion = ({ verbiage, ...props }: Props) => (
  <Accordion sx={sx.root} allowToggle={true} {...props}>
    <AccordionItem label={verbiage.buttonLabel}>
      <Text sx={sx.text}>{verbiage.text}</Text>
      {verbiage.table && (
        <Table
          content={verbiage.table}
          variant="striped"
          lastCellsBold
          {...sx.table}
        />
      )}
      {verbiage.list && (
        <UnorderedList sx={sx.list}>
          {verbiage.list.map((listItem: string, index: number) => (
            <ListItem key={index}>{listItem}</ListItem>
          ))}
        </UnorderedList>
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
  list: {
    paddingLeft: "1rem",
    "li:last-of-type": {
      fontWeight: "bold",
    },
  },
  table: {
    marginTop: "1rem",
  },
};
