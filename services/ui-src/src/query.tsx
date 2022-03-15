import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export const QueryProvider = ({ children }: any) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
