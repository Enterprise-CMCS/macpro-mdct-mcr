// utils
import { IconType } from "../../utils/types/types";
// components
import { Icon } from "@chakra-ui/react";
// assets
import {
  BsBoxArrowRight,
  BsChevronDown,
  BsFillPersonFill,
  BsQuestionCircleFill,
} from "react-icons/bs";

const iconMap: { [char: string]: IconType } = {
  boxArrowRight: BsBoxArrowRight,
  chevronDown: BsChevronDown,
  personFill: BsFillPersonFill,
  questionCircleFill: BsQuestionCircleFill,
};

export default ({ icon }: Props) => {
  return <Icon as={iconMap[icon]} sx={sx.icon} />;
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
