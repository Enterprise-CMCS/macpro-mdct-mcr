// components
import { Flex, Image, Text } from "@chakra-ui/react";
import { Icon } from "components";

export const MenuOption = ({ text, icon, role, hideText }: Props) => {
  // TODO: Replace Log Out with custom graphic asset
  return (
    <Flex
      align="center"
      role={role}
      sx={!hideText ? { paddingRight: ".5rem" } : {}}
    >
      {text === "Manage Account" ? (
        <Image src={icon} alt="Edit" sx={sx.editIcon} />
      ) : text === "Get Help" ? (
        <Image src={icon} alt="Get Help" sx={sx.helpIcon} />
      ) : (
        <Icon
          icon={icon}
          margin=".5rem"
          fontSize="1.4rem"
          color="palette.white"
        />
      )}
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
  text: {
    fontWeight: "bold",
    color: "palette.white",
    _groupHover: { color: "palette.gray_lighter" },
  },
  editIcon: {
    width: "1.5rem",
    margin: "0.5rem",
  },
  helpIcon: {
    width: "1.75rem",
    margin: "0.5rem",
  },
};
