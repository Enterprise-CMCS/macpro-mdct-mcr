import { useEffect } from "react";
import { useLocation, Route, Routes } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
// components
import { Container, Divider, Flex, Heading, Stack } from "@chakra-ui/react";
import {
  AppRoutes,
  Error,
  ExportedReportBanner,
  Footer,
  Header,
  LoginCognito,
  LoginIDM,
  MainSkipNav,
  ReportProvider,
  Timeout,
  PostLogoutRedirect,
} from "components";
// utils
import {
  fireTealiumPageView,
  isApparentReportPage,
  makeMediaQueryClasses,
  useStore,
} from "utils";

export const App = () => {
  const mqClasses = makeMediaQueryClasses();

  // state management
  const { user, showLocalLogins } = useStore();

  const { pathname, key } = useLocation();
  const isExportPage = pathname.includes("/export");

  // fire tealium page view on route change
  useEffect(() => {
    fireTealiumPageView(
      user,
      window.location.href,
      pathname,
      isApparentReportPage(pathname)
    );
  }, [key]);

  const authenticatedRoutes = (
    <>
      {user && (
        <Flex sx={sx.appLayout}>
          <ReportProvider>
            <Timeout />
            <MainSkipNav />
            {!isExportPage && <Header />}
            {isExportPage && <ExportedReportBanner />}
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
    </>
  );

  return (
    <div id="app-wrapper" className={mqClasses}>
      <Routes>
        <Route path="*" element={authenticatedRoutes} />
        <Route path="postLogout" element={<PostLogoutRedirect />} />
      </Routes>
    </div>
  );
};

const sx = {
  appLayout: {
    minHeight: "100vh",
    flexDirection: "column",
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
