// utils
import { useUser } from "utils/auth";
// components
import { Container, Divider, Stack } from "@chakra-ui/react";
import { AppRoutes, Footer, Header, LoginCognito, LoginIDM } from "components";

export const App = () => {
  const { logout, user, showLocalLogins, loginWithIDM } = useUser();
  return (
    <div id="app-wrapper">
      {user && (
        <>
          <Header handleLogout={logout} />
          <Container sx={{ maxW: "7xl" }}>
            <AppRoutes />
          </Container>
          <Footer />
        </>
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
