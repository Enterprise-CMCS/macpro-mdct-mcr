// components
import { Icon as ChakraIcon } from "@chakra-ui/react";
// assets
import {
  BsArrowRightSquare,
  BsChevronDown,
  BsPersonCircle,
  BsPlus,
} from "react-icons/bs";
import { FiMinus } from "react-icons/fi";
// utils
import { IconType } from "types";

// icons from https://react-icons.github.io/react-icons/
const iconMap: { [key: string]: IconType } = {
  arrowRightSquare: BsArrowRightSquare,
  chevronDown: BsChevronDown,
  personCircle: BsPersonCircle,
  plus: BsPlus,
  minus: FiMinus,
};

export const Icon = ({ icon, boxSize, color, fontSize, margin }: Props) => {
  return (
    <ChakraIcon
      as={iconMap[icon]}
      sx={sx.icon}
      boxSize={boxSize}
      margin={margin}
      fontSize={fontSize}
      color={color}
    />
  );
};

interface Props {
  icon: string;
  boxSize?: string;
  margin?: string;
  fontSize?: string;
  color?: string;
}

const sx = {
  icon: {
    transition: "all 0.3s ease",
    _groupHover: { color: "palette.gray_lighter" },
  },
};
