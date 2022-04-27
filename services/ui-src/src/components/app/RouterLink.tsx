import { ReactChild } from "react";
import { Link } from "react-router-dom";
// utils
import { useBreakpoint } from "utils/useBreakpoint";
import { StyleObject } from "../../utils/types/types";

export const RouterLink = ({
  to,
  alt,
  tabindex,
  underline,
  children,
}: Props) => {
  const { isMobile } = useBreakpoint();
  return (
    <Link
      to={to}
      title={alt}
      tabIndex={tabindex}
      style={{
        ...(underline ? {} : { textDecoration: "none" }),
      }}
      className={isMobile ? "mobile" : ""}
    >
      {children}
    </Link>
  );
};

interface Props {
  to: string;
  alt: string;
  tabindex?: number;
  underline?: boolean;
  styleOverride?: StyleObject;
  children?: ReactChild | ReactChild[];
}
