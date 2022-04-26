// components
import { Flex, Text } from "@chakra-ui/react";
import { Icon } from "../index";
// utils
import { useBreakpoint } from "../../utils/useBreakpoint";

export const MenuOption = ({ text, icon, role, mobileStylez }: Props) => {
  const { isMobile } = useBreakpoint();
  return (
    <Flex align="center" role={role} sx={sx.menuOption}>
      <Icon icon={icon} />
      <Text
        sx={{ ...sx.text, ...(isMobile && mobileStylez ? sx.atMobile : {}) }}
      >
        {text}
      </Text>
    </Flex>
  );
};

interface Props {
  text: string;
  icon: string;
  role?: string;
  mobileStylez?: boolean;
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
  atMobile: {
    display: "none",
  },
};
