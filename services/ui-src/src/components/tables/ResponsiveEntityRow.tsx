// components
import { EntityRow, MobileEntityRow } from "components";
// types
import { EntityRowProps } from "./EntityRow";
// utils
import { useBreakpoint } from "utils";

export const ResponsiveEntityRow = (props: EntityRowProps) => {
  const { isTablet, isMobile } = useBreakpoint();

  return isMobile || isTablet ? (
    <MobileEntityRow {...props} />
  ) : (
    <EntityRow {...props} />
  );
};
