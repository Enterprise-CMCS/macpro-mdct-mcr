import { QueryClient, QueryClientProvider } from "react-query";

export const QueryProvider = ({ children }: any) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);
