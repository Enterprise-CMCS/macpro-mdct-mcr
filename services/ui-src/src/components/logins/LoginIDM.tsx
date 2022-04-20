// components
import { Box, Button, Divider, Heading } from "@chakra-ui/react";

interface Props {
  loginWithIDM: () => void;
}

export const LoginIDM = ({ loginWithIDM }: Props) => (
  <Box textAlign="center" mb="6">
    <Heading mb="2" size="md" alignSelf="center">
      Login with IDM
    </Heading>
    <Divider />
    <Button colorScheme="teal" onClick={loginWithIDM} isFullWidth>
      Login with IDM
    </Button>
  </Box>
);
