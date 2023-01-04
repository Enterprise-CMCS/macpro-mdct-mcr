import { ReactNode, useEffect, useMemo, createContext } from "react";
import { API } from "aws-amplify";
import config from "config";

export const ApiContext = createContext(null);

interface Props {
  children?: ReactNode;
}

export const ApiProvider = ({ children }: Props) => {
  useEffect(() => {
    const endpoints = [
      {
        name: "mcrApi",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    ];
    if (config.DEV_API_URL) {
      // Add dev endpoint for pdf printing access locally
      endpoints.push({
        name: "mcrDev",
        endpoint: config.DEV_API_URL,
        region: "us-east-1",
      });
    }
    API.configure({
      endpoints: endpoints,
    });
  }, []);

  const values = useMemo(() => ({}), []);
  // @ts-ignore
  return <ApiContext.Provider value={values}>{children}</ApiContext.Provider>;
};
