// components
import { Accordion, ListItem, OrderedList, Text } from "@chakra-ui/react";
import { AccordionItem } from "components";
// types
import { AnyObject } from "types";
// utils
import { parseCustomHtml } from "utils";

export const TemplateCardAccordion = ({ verbiage, ...props }: Props) => {
  const { buttonLabel, orderedList, text } = verbiage;
  return (
    <Accordion sx={sx.root} allowToggle={true} {...props}>
      <AccordionItem label={buttonLabel}>
        {text && <Text sx={sx.text}>{parseCustomHtml(text)}</Text>}
        {orderedList?.length > 0 && (
          <OrderedList sx={sx.orderedList}>
            {orderedList.map((item: string, index: number) => (
              <ListItem key={index}>{item}</ListItem>
            ))}
          </OrderedList>
        )}
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
    marginTop: "spacer4",
  },
  text: {
    marginBottom: "spacer2",
  },
  orderedList: {
    paddingLeft: "spacer2",
    "& > li": {
      marginBottom: "0.75rem",
    },
    "& > li::marker": {
      fontWeight: "normal",
    },
  },
};
