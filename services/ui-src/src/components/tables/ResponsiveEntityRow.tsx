// components
import { EntityRow, MobileEntityRow } from "components";
// types
import { EntityRowProps } from "./EntityRow";
// utils
import { useBreakpoint } from "utils";

export const ResponsiveEntityRow = (props: EntityRowProps) => {
  const { isMobile } = useBreakpoint();

  return isMobile ? <MobileEntityRow {...props} /> : <EntityRow {...props} />;
};
