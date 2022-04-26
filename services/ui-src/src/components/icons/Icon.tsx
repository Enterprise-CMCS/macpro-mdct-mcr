// utils
import { IconType } from "../../utils/types/types";
// components
import { Icon as ChakraIcon } from "@chakra-ui/react";
// assets
import {
  BsBoxArrowRight,
  BsChevronDown,
  BsFillPersonFill,
  BsPersonCircle,
  BsQuestionCircleFill,
} from "react-icons/bs";

const iconMap: { [char: string]: IconType } = {
  boxArrowRight: BsBoxArrowRight,
  chevronDown: BsChevronDown,
  personCircle: BsPersonCircle,
  personFill: BsFillPersonFill,
  questionCircleFill: BsQuestionCircleFill,
};

export const Icon = ({ icon }: Props) => {
  return <ChakraIcon as={iconMap[icon]} sx={sx.icon} />;
};

interface Props {
  icon: string;
}

const sx = {
  icon: {
    margin: ".5rem",
    fontSize: "1.4rem",
    color: "palette.white",
    transition: "all 0.3s ease",
    _groupHover: { color: "palette.alt_light" },
  },
};
