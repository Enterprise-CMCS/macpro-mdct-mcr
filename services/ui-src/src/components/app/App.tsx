import { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
// components
import { Container, Divider, Flex, Heading, Stack } from "@chakra-ui/react";
import {
  AppRoutes,
  Error,
  Footer,
  Header,
  LoginCognito,
  LoginIDM,
  SkipNav,
  Sidebar,
} from "components";
// utils
import { useUser, fireTealiumPageView } from "utils";

export const SidebarOpenContext = createContext({
  sidebarIsOpen: true,
  setSidebarIsOpen: (status: boolean) => {}, // eslint-disable-line @typescript-eslint/no-unused-vars
});

export const App = () => {
  const { logout, user, showLocalLogins } = useUser();
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);

  const { pathname, key } = useLocation();
  useEffect(() => {
    const contentType = pathname.includes("/mcpar") ? "form" : "app";
    const sectionName = pathname.includes("/mcpar") ? "MCPAR form" : "Main app";
    fireTealiumPageView(
      user,
      window.location.href,
      contentType,
      sectionName,
      pathname
    );
  }, [key]);

  return (
    <div id="app-wrapper">
      {user && (
        <Flex sx={sx.appLayout}>
          <SkipNav
            id="skip-nav-main"
            href="#main-content"
            text="Skip to main content"
          />
          <Header handleLogout={logout} />
          <SidebarOpenContext.Provider
            value={{ sidebarIsOpen, setSidebarIsOpen }}
          >
            <Container sx={sx.appContainer} data-testid="app-container">
              <Sidebar />
              <ErrorBoundary FallbackComponent={Error}>
                <AppRoutes userRole={user?.userRole} />
              </ErrorBoundary>
            </Container>
          </SidebarOpenContext.Provider>
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
    maxWidth: "25rem",
    height: "full",
    marginY: "auto",
  },
};
