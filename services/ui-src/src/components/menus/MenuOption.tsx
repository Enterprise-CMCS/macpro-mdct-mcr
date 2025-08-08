// components
import { Flex, Image, Text } from "@chakra-ui/react";

export const MenuOption = ({ text, icon, altText, role, hideText }: Props) => {
  return (
    <Flex
      align="center"
      role={role}
      sx={!hideText ? { paddingRight: ".5rem" } : {}}
    >
      <Image src={icon} alt={altText} sx={sx.menuIcon} />
      {!hideText && <Text sx={sx.text}>{text}</Text>}
    </Flex>
  );
};

interface Props {
  text: string;
  icon: string;
  altText: string;
  role?: string;
  hideText?: boolean;
}

const sx = {
  text: {
    fontWeight: "bold",
    color: "white",
    _groupHover: { color: "gray_lighter" },
  },
  menuIcon: {
    width: "1.5rem",
    margin: "0.5rem",
  },
};
