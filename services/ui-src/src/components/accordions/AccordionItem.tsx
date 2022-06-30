import { ReactChild } from "react";
// components
import {
  AccordionButton,
  AccordionItem as AccordionItemRoot,
  AccordionPanel,
  Text,
} from "@chakra-ui/react";
import { Icon } from "components";
// utils
import { makeMediaQueryClasses } from "utils";

export const AccordionItem = ({ label, children, ...props }: Props) => {
  const mqClasses = makeMediaQueryClasses();

  return (
    <AccordionItemRoot sx={sx.root} {...props}>
      {({ isExpanded }) => (
        <>
          <AccordionButton
            sx={sx.accordionButton}
            aria-label={label}
            title="accordion-button"
          >
            <Text flex="1">{label}</Text>
            <Icon
              icon={isExpanded ? "minus" : "plus"}
              boxSize={isExpanded ? "1.5rem" : "2rem"}
            />
          </AccordionButton>
          <AccordionPanel sx={sx.accordionPanel} className={mqClasses}>
            {children}
          </AccordionPanel>
        </>
      )}
    </AccordionItemRoot>
  );
};

interface Props {
  children?: ReactChild | ReactChild[];
  [key: string]: any;
}

const sx = {
  root: {
    borderStyle: "none",
  },
  accordionButton: {
    minHeight: "3.5rem",
    bg: "palette.gray_lightest",
    textAlign: "left",
  },
  accordionPanel: {
    padding: "1.5rem 1rem 0.5rem",
    "&.mobile": {
      padding: "0.5rem 0",
    },
  },
};
