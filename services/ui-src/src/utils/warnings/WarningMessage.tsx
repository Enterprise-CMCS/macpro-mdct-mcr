import { Box, Image, Text } from "@chakra-ui/react";
import warningIconBrown from "assets/icons/icon_warning_brown.svg";

interface Props {
  messages: string[];
  id: string;
}

// Each message renders as its own warning, each with its own icon
export const WarningMessage = ({ messages, id }: Props) => (
  <Box role="alert" id={id}>
    {messages.map((message) => (
      <Text
        key={message}
        display="block"
        fontSize="sm"
        color="warn_darkest"
        marginTop="spacer_half"
      >
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
    ))}
  </Box>
);
