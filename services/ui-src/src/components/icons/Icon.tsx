// utils
import { IconType } from "../../utils/types/types";
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

const iconMap: { [key: string]: IconType } = {
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
