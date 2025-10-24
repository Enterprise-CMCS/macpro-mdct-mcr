import { useContext } from "react";
// components
import { Box, Button, Heading } from "@chakra-ui/react";
// utils
import { UserContext } from "utils";

export const LoginIDM = () => {
  const context = useContext(UserContext);
  const { loginWithIDM } = context;

  return (
    <Box sx={sx.root}>
      <Heading as="h2" size="md" sx={sx.heading}>
        Log In with IDM
      </Heading>
      <Button sx={sx.button} onClick={loginWithIDM}>
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
    marginBottom: "spacer4",
    alignSelf: "center",
  },
  button: {
    width: "100%",
  },
};
