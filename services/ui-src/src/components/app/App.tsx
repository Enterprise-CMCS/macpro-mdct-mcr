import { useEffect } from "react";
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
} from "components";
// utils
import { fireTealiumPageView, makeMediaQueryClasses, useUser } from "utils";

export const App = () => {
  const mqClasses = makeMediaQueryClasses();
  const { logout, user, showLocalLogins } = useUser();
  const { pathname, key } = useLocation();

  // fire tealium page view on route change
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
          <Container
            sx={sx.appContainer}
            className={mqClasses}
            data-testid="app-container"
          >
            <ErrorBoundary FallbackComponent={Error}>
              <AppRoutes userRole={user?.userRole} />
            </ErrorBoundary>
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
    "&.desktop": {
      padding: "0 2rem",
    },
  },
  loginContainer: {
    maxWidth: "25rem",
    height: "full",
    marginY: "auto",
  },
};
