// components
import {
  Accordion,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { AccordionItem, Table } from "components";
// types
import { AnyObject } from "types";

export const TemplateCardAccordion = ({ verbiage, ...props }: Props) => (
  <Accordion sx={sx.root} allowToggle={true} {...props}>
    <AccordionItem label={verbiage.buttonLabel}>
      <Text sx={sx.text}>{verbiage.text}</Text>
      <Text sx={sx.text}>{verbiage.introText}</Text>

      {verbiage.list?.length > 0 && (
        <UnorderedList sx={sx.list}>
          {verbiage.list.map((listItem: string, index: number) => (
            <ListItem key={index}>{listItem}</ListItem>
          ))}
        </UnorderedList>
      )}
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
      {verbiage.table && (
        <Table
          content={verbiage.table}
          variant="striped"
          sxOverride={sx.table}
        />
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
