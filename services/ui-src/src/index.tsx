import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Amplify } from "aws-amplify";
import config from "config";
// utils
import { ApiProvider, UserProvider } from "utils";
import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";
// components
import { App, Error } from "components";
// styles
import { ChakraProvider } from "@chakra-ui/react";
import theme from "styles/theme";
import "./styles/index.scss";

Amplify.configure({
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
  },
});

// LaunchDarkly configuration
const ldClientId = config.REACT_APP_LD_SDK_CLIENT;
(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: ldClientId!,
    options: {
      baseUrl: "https://clientsdk.launchdarkly.us",
      streamUrl: "https://clientstream.launchdarkly.us",
      eventsUrl: "https://events.launchdarkly.us",
    },
    deferInitialization: false,
  });

  ReactDOM.render(
    <ErrorBoundary FallbackComponent={Error}>
      <Router>
        <UserProvider>
          <ApiProvider>
            <ChakraProvider theme={theme}>
              <LDProvider>
                <App />
              </LDProvider>
            </ChakraProvider>
          </ApiProvider>
        </UserProvider>
      </Router>
    </ErrorBoundary>,
    document.getElementById("root")
  );
})().catch((e) => {
  throw e;
});
