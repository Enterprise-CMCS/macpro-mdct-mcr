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
        name: "mcr",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    ];
    API.configure({
      endpoints: endpoints,
    });
  }, []);

  const values = useMemo(() => ({}), []);
  // @ts-ignore
  return <ApiContext.Provider value={values}>{children}</ApiContext.Provider>;
};
