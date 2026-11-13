import { Image, Text } from "@chakra-ui/react";
import warningIconBrown from "assets/icons/icon_warning_brown.svg";
import { warningMessageSx } from "utils";

interface Props {
  message: string;
  id: string;
}

export const WarningMessage = ({ message, id }: Props) => (
  <Text sx={warningMessageSx} role="alert" id={id}>
    <Image
      src={warningIconBrown}
      alt=""
      aria-hidden="true"
      boxSize="16px"
      display="inline"
      verticalAlign="middle"
      marginRight="spacer_half"
    />
    {message}
  </Text>
);
