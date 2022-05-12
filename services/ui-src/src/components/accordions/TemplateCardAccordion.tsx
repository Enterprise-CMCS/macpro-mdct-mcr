// components
import { Accordion, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { AccordionItem, Table } from "../index";
// utils
import { JsonObject } from "utils/types/types";

export const TemplateCardAccordion = ({ verbiage }: Props) => (
  <Accordion
    sx={sx.root}
    allowToggle={true}
    data-testid="template-card-accordion"
  >
    <AccordionItem label={verbiage.buttonLabel}>
      <Text>{verbiage.bodyText}</Text>
      {verbiage.table && (
        <Table
          content={verbiage.table}
          variant="striped"
          lastCellsBold
          {...sx.table}
          dataTestId="template-card-accordion-table"
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
