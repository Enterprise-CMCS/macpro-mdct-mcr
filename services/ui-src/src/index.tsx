import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import { Amplify } from "aws-amplify";
import config from "config";
// utils
import * as serviceWorker from "utils/serviceWorker";
import { UserProvider, ApiProvider } from "hooks/authHooks";
// components
import { App, QueryProvider } from "components";
// styles
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "styles/theme";
import "./styles/index.scss";

Amplify.configure({
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
  },
});

ReactDOM.render(
  <Router>
    <UserProvider>
      <ApiProvider>
        <QueryProvider>
          <ChakraProvider theme={theme}>
            <App />
          </ChakraProvider>
          <ReactQueryDevtools />
        </QueryProvider>
      </ApiProvider>
    </UserProvider>
  </Router>,
  document.getElementById("root")
);

/*
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below. Note this comes with some pitfalls.
 * Learn more about service workers: https://bit.ly/CRA-PWA
 */
serviceWorker.unregister();
