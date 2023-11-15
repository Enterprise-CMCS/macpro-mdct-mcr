// utils
import { useStore } from "utils";
// components
import { Box, Button, Heading } from "@chakra-ui/react";

export const LoginIDM = () => {
  const { loginWithIDM } = useStore();

  return (
    <Box sx={sx.root}>
      <Heading as="h2" size="md" sx={sx.heading}>
        Log In with IDM
      </Heading>
      <Button sx={sx.button} onClick={loginWithIDM} isFullWidth>
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
