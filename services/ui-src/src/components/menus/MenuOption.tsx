// components
import { Flex, Text } from "@chakra-ui/react";
import { Icon } from "../index";

export const MenuOption = ({ text, icon, hasGroupRole }: Props) => {
  return (
    <Flex align="center" role={hasGroupRole ? "group" : undefined}>
      <Icon icon={icon} />
      <Text sx={sx.text}>{text}</Text>
    </Flex>
  );
};

interface Props {
  text: string;
  icon: string;
  hasGroupRole?: boolean;
}

const sx = {
  text: {
    fontWeight: "bold",
    color: "palette.white",
    _groupHover: { color: "palette.alt_light" },
  },
};
