// components
import { Accordion, Box } from "@chakra-ui/react";
import { AccordionItem } from "components";
// types
import { AnyObject } from "types";

export const FormIntroAccordion = ({ verbiage, ...props }: Props) => {
  const { info } = verbiage;
  return (
    <Accordion allowToggle={true} allowMultiple={true} {...props}>
      <AccordionItem label={verbiage.buttonLabel} sx={sx.item}>
        <Box sx={sx.answerBox}>{info.content}</Box>
      </AccordionItem>
    </Accordion>
  );
};

interface Props {
  verbiage: AnyObject;
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
