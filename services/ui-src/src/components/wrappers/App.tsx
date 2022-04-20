// utils
import { useUser } from "hooks/authHooks";
// components
import { Container, Stack } from "@chakra-ui/react";
import { AppRoutes, Header, LoginCognito, LoginIDM } from "components";

export const App = () => {
  const { logout, user, showLocalLogins, loginWithIDM } = useUser();
  return (
    <div id="app-wrapper">
      {user && (
        <>
          <Header handleLogout={logout} />
          <AppRoutes />
        </>
      )}
      {!user && showLocalLogins && (
        <Container maxW="sm" h="full" my="auto">
          <Stack spacing={8}>
            <LoginIDM loginWithIDM={loginWithIDM} />
            <LoginCognito />
          </Stack>
        </Container>
      )}
    </div>
  );
};
