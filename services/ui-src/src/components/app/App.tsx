// utils
import { useUser } from "utils/auth";
// components
import { Container, Divider, Flex, Heading, Stack } from "@chakra-ui/react";
import { AppRoutes, Footer, Header, LoginCognito, LoginIDM } from "components";

export const App = () => {
  const { logout, user, showLocalLogins } = useUser();
  return (
    <div id="app-wrapper">
      {user && (
        <Flex sx={sx.appLayout}>
          <Header handleLogout={logout} />
          <Container sx={sx.appContainer} data-testid="app-container">
            <AppRoutes userRole={user?.userRole} />
          </Container>
          <Footer />
        </Flex>
      )}
      {!user && showLocalLogins && (
        <main>
          <Container sx={sx.appContainer}>
            <Heading as="h1" size="xl" sx={{ my: "6rem", textAlign: "center" }}>
              Managed Care Reporting
            </Heading>
          </Container>
          <Container sx={sx.loginContainer} data-testid="login-container">
            <Stack spacing={8}>
              <LoginIDM />
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
    minHeight: "100vh",
    flexDirection: "column",
  },
  appContainer: {
    maxW: "appMax",
    flex: "1 0 auto",
  },
  loginContainer: {
    maxWidth: "sm",
    height: "full",
    marginY: "auto",
  },
};
