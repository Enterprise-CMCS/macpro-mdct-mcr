import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const QueryProvider = ({ children }: any) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
