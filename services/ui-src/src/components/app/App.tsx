import { useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  ReportProvider,
  SkipNav,
} from "components";
// utils
import {
  fireTealiumPageView,
  getCurrentReportFormPageType,
  makeMediaQueryClasses,
  useUser,
} from "utils";

export const App = () => {
  const mqClasses = makeMediaQueryClasses();
  const { logout, user, showLocalLogins } = useUser();
  const { pathname, key } = useLocation();
  const currentReportFormPageType = getCurrentReportFormPageType(pathname);
  const isReportFormPage = currentReportFormPageType;

  // fire tealium page view on route change
  useEffect(() => {
    const contentType = isReportFormPage ? "form" : "app";
    const sectionName = currentReportFormPageType || "main app";
    fireTealiumPageView(
      user,
      window.location.href,
      contentType,
      sectionName,
      pathname
    );
  }, [key]);

  return (
    <div id="app-wrapper" className={mqClasses}>
      {user && (
        <Flex sx={sx.appLayout}>
          <SkipNav
            id="skip-nav-main"
            href={isReportFormPage ? "#skip-nav-sidebar" : "#main-content"}
            text={`Skip to ${
              isReportFormPage ? "report sidebar" : "main content"
            }`}
            sxOverride={sx.skipnav}
          />
          <ReportProvider>
            <Header handleLogout={logout} />
            <Container sx={sx.appContainer} data-testid="app-container">
              <ErrorBoundary FallbackComponent={Error}>
                <AppRoutes />
              </ErrorBoundary>
            </Container>
            <Footer />
          </ReportProvider>
        </Flex>
      )}
      {!user && showLocalLogins && (
        <main>
          <Container sx={sx.appContainer}>
            <Heading as="h1" size="xl" sx={sx.loginHeading}>
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
  skipnav: {
    position: "absolute",
  },
  appContainer: {
    display: "flex",
    maxW: "appMax",
    flex: "1 0 auto",
    ".desktop &": {
      padding: "0 2rem",
    },
    "#main-content": {
      section: {
        flex: "1",
      },
    },
  },
  loginContainer: {
    maxWidth: "25rem",
    height: "full",
    marginY: "auto",
  },
  loginHeading: {
    my: "6rem",
    textAlign: "center",
    width: "100%",
  },
};
