// utils
import { useUser } from "utils/auth";
// components
import { Container, Divider, Flex, Stack } from "@chakra-ui/react";
import { AppRoutes, Footer, Header, LoginCognito, LoginIDM } from "components";

export const App = () => {
  const { logout, user, showLocalLogins, loginWithIDM } = useUser();
  return (
    <div id="app-wrapper">
      {user && (
        <Flex sx={sx.appLayout}>
          <Header handleLogout={logout} />
          <Container sx={sx.appContainer}>
            <AppRoutes />
          </Container>
          <Footer />
        </Flex>
      )}
      {!user && showLocalLogins && (
        <Container sx={sx.loginContainer}>
          <Stack spacing={8}>
            <LoginIDM loginWithIDM={loginWithIDM} />
            <Divider />
            <LoginCognito />
          </Stack>
        </Container>
      )}
    </div>
  );
};

const sx = {
  appLayout: {
    flexDirection: "column",
    minHeight: "100vh",
  },
  appContainer: {
    maxW: "7xl",
    flex: "1 0 auto",
  },
  loginContainer: {
    maxWidth: "sm",
    height: "full",
    marginY: "auto",
  },
};
