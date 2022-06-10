// utils
import { useUser } from "utils/auth";
// components
import { Box, Button, Divider, Heading } from "@chakra-ui/react";

export const LoginIDM = () => {
  const { loginWithIDM } = useUser();

  return (
    <Box textAlign="center">
      <Heading mb="2" size="md" alignSelf="center">
        Log In with IDM
      </Heading>
      <Divider />
      <Button
        colorScheme="colorSchemes.main"
        onClick={loginWithIDM}
        isFullWidth
      >
        Log In with IDM
      </Button>
    </Box>
  );
};
