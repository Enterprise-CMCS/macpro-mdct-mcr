// components
import { Flex, Text } from "@chakra-ui/react";
import { Icon } from "../index";

export const MenuOption = ({ text, icon, role, hideText }: Props) => {
  return (
    <Flex align="center" role={role} sx={sx.menuOption}>
      <Icon icon={icon} />
      {!hideText && <Text sx={sx.text}>{text}</Text>}
    </Flex>
  );
};

interface Props {
  text: string;
  icon: string;
  role?: string;
  hideText?: boolean;
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
