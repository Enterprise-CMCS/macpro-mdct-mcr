// components
import { Icon as ChakraIcon } from "@chakra-ui/react";
// assets
import {
  BsArrowRightSquare,
  BsBoxArrowRight,
  BsChevronDown,
  BsFileEarmarkSpreadsheetFill,
  BsPencilSquare,
  BsPersonCircle,
  BsPlus,
  BsQuestionCircleFill,
} from "react-icons/bs";
import { FiMinus } from "react-icons/fi";
import { HiDownload } from "react-icons/hi";
import { ImArrowLeft2, ImArrowRight2 } from "react-icons/im";

// utils
import { IconType } from "types";

// icons from https://react-icons.github.io/react-icons/
const iconMap: { [key: string]: IconType } = {
  arrowLeft: ImArrowLeft2,
  arrowRight: ImArrowRight2,
  arrowRightSquare: BsArrowRightSquare,
  boxArrowRight: BsBoxArrowRight,
  chevronDown: BsChevronDown,
  downloadArrow: HiDownload,
  spreadsheet: BsFileEarmarkSpreadsheetFill,
  pencilSquare: BsPencilSquare,
  personCircle: BsPersonCircle,
  plus: BsPlus,
  questionCircleFill: BsQuestionCircleFill,
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
    _groupHover: { color: "palette.alt_light" },
  },
};
