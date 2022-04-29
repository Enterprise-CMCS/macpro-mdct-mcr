// utils
import { useUser } from "utils/auth";
// components
import { Container, Divider, Flex, Heading, Stack } from "@chakra-ui/react";
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
        <main>
          <Container sx={sx.appContainer}>
            <Heading as="h1" size="xl" sx={{ my: "6rem" }}>
              Managed Care Reporting
            </Heading>
          </Container>
          <Container sx={sx.loginContainer}>
            <Stack spacing={8}>
              <LoginIDM loginWithIDM={loginWithIDM} />
              <Divider />
              <LoginCognito />
            </Stack>
          </Container>
        </main>
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
    textAlign: "center",
  },
  loginContainer: {
    maxWidth: "sm",
    height: "full",
    marginY: "auto",
  },
};
