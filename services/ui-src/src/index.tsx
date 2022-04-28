import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
// import { ReactQueryDevtools } from "react-query/devtools";
import { Amplify } from "aws-amplify";
import config from "config";
// utils
import { ApiProvider, QueryProvider } from "utils/api";
import { UserProvider } from "utils/auth";
// components
import { App } from "components";
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
          {/* <ReactQueryDevtools /> */}
        </QueryProvider>
      </ApiProvider>
    </UserProvider>
  </Router>,
  document.getElementById("root")
);
