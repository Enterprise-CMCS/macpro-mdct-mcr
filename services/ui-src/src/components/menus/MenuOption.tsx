// components
import { Flex, Text } from "@chakra-ui/react";
import { Icon } from "../index";
// utils
import { StyleObject } from "../../utils/types/types";

export const MenuOption = ({ text, icon, role, mobileStyles }: Props) => {
  return (
    <Flex align="center" role={role} sx={sx.menuOption}>
      <Icon icon={icon} />
      <Text sx={{ ...sx.text, ...mobileStyles }}>{text}</Text>
    </Flex>
  );
};

interface Props {
  text: string;
  icon: string;
  role?: string;
  mobileStyles?: StyleObject | null;
}

const sx = {
  menuOption: {
    paddingRight: ".5rem",
  },
  text: {
    fontWeight: "bold",
    color: "palette.white",
    _groupHover: { color: "palette.alt_light" },
  },
};
