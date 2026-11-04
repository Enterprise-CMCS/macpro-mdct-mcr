import { Box, Image, Text } from "@chakra-ui/react";
import warningIconBrown from "assets/icons/icon_warning_brown.svg";

interface Props {
  message: string;
  id: string;
}

// A message containing line breaks renders as separate warnings, each with its own icon
export const WarningMessage = ({ message, id }: Props) => (
  <Box role="alert" id={id}>
    {message.split("\n").map((line) => (
      <Text
        key={line}
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
        {line}
      </Text>
    ))}
  </Box>
);
