// components
import { Flex, Text } from "@chakra-ui/react";
import { Icon } from "../index";

export const MenuOption = ({
  text,
  icon,
  role,
  hideText,
  dataTestId,
}: Props) => {
  return (
    <Flex
      align="center"
      role={role}
      sx={!hideText ? { paddingRight: ".5rem" } : {}}
      data-testid={dataTestId}
    >
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
  dataTestId?: string;
}

const sx = {
  text: {
    fontWeight: "bold",
    color: "palette.white",
    _groupHover: { color: "palette.alt_light" },
  },
};
