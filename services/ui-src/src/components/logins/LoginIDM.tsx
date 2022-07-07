// utils
import { useUser } from "utils";
// components
import { Box, Button, Heading } from "@chakra-ui/react";

export const LoginIDM = () => {
  const { loginWithIDM } = useUser();

  return (
    <Box sx={sx.root}>
      <Heading size="md" sx={sx.heading}>
        Log In with IDM
      </Heading>
      <Button
        sx={sx.button}
        colorScheme="colorSchemes.main"
        onClick={loginWithIDM}
        isFullWidth
      >
        Log In with IDM
      </Button>
    </Box>
  );
};

const sx = {
  root: {
    textAlign: "center",
  },
  heading: {
    marginBottom: "2rem",
    alignSelf: "center",
  },
  button: {
    width: "100%",
  },
};
