import { ReactChild } from "react";
import { Link as RouterLinkRoot } from "react-router-dom";
// utils
import { makeMediaQueryClasses } from "utils/useBreakpoint";
import { StyleObject } from "../../utils/types/types";

export const RouterLink = ({
  to,
  alt,
  tabindex,
  underline,
  children,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();
  return (
    <RouterLinkRoot
      to={to}
      title={alt}
      tabIndex={tabindex}
      style={{
        ...(underline ? {} : { textDecoration: "none" }),
      }}
      className={mqClasses}
      {...props}
    >
      {children}
    </RouterLinkRoot>
  );
};

interface Props {
  to: string;
  alt: string;
  tabindex?: number;
  underline?: boolean;
  styleOverride?: StyleObject;
  children?: ReactChild | ReactChild[];
  [key: string]: any;
}
