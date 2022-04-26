// components
import { Flex, Text } from "@chakra-ui/react";
import { Icon } from "../index";
// utils
import { useBreakpoint } from "../../utils/useBreakpoint";

export const MenuOption = ({ text, icon, role, hideTextOnMobile }: Props) => {
  const { isMobile } = useBreakpoint();

  return (
    <Flex align="center" role={role} sx={sx.menuOption}>
      <Icon icon={icon} />
      {!(isMobile && hideTextOnMobile) && <Text sx={sx.text}>{text}</Text>}
    </Flex>
  );
};

interface Props {
  text: string;
  icon: string;
  role?: string;
  hideTextOnMobile?: boolean;
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
