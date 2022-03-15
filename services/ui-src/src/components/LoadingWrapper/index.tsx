import { LoadingWave } from "components";

export const LoadingWrapper = ({
  isLoaded,
  children,
}: {
  isLoaded: boolean;
  children: any;
}) => {
  if (isLoaded) return children;
  return <LoadingWave />;
};
