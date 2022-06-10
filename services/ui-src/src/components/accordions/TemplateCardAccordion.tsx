// components
import { Accordion, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { AccordionItem, Table } from "../index";
// utils
import { JsonObject } from "utils/types/types";

export const TemplateCardAccordion = ({ verbiage, ...props }: Props) => (
  <Accordion sx={sx.root} allowToggle={true} {...props}>
    <AccordionItem label={verbiage.buttonLabel}>
      <Text>{verbiage.bodyText}</Text>
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
          {verbiage.list.map((item: string, index: number) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </UnorderedList>
      )}
    </AccordionItem>
  </Accordion>
);

interface Props {
  verbiage: JsonObject;
  [key: string]: any;
}

const sx = {
  root: {
    marginTop: "2rem",
  },
  table: {
    marginTop: "1rem",
  },
  list: {
    marginTop: "1rem",
  },
};
