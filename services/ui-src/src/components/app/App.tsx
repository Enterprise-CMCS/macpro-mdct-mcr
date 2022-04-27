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
        <Flex flexDirection="column" sx={{ minHeight: "100vh" }}>
          <Header handleLogout={logout} />
          <Container sx={{ maxW: "7xl", flex: "1 0 auto" }}>
            <AppRoutes />
          </Container>
          <Footer />
        </Flex>
      )}
      {!user && showLocalLogins && (
        <Container maxW="sm" h="full" my="auto">
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
