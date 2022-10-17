import { ReactChild } from "react";
// components
import {
  AccordionButton,
  AccordionItem as AccordionItemRoot,
  AccordionPanel,
  Image,
  Text,
} from "@chakra-ui/react";
// assets
import plusIcon from "assets/icons/icon_plus.png";
import minusIcon from "assets/icons/icon_minus.png";

export const AccordionItem = ({ label, children, ...props }: Props) => {
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
            <Image
              src={isExpanded ? minusIcon : plusIcon}
              sx={sx.accordionIcon}
            />
          </AccordionButton>
          <AccordionPanel sx={sx.accordionPanel}>{children}</AccordionPanel>
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
    ".mobile &": {
      padding: "0.5rem 0",
    },
  },
  accordionIcon: {
    width: "1rem",
  },
};
