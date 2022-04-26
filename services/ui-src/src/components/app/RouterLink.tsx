import { ReactChild } from "react";
import { Link } from "react-router-dom";
// utils
import { StyleObject } from "../../utils/types/types";

export const RouterLink = ({
  to,
  alt,
  tabindex,
  underline,
  styleOverride,
  children,
}: Props) => {
  return (
    <Link
      to={to}
      title={alt}
      tabIndex={tabindex}
      style={{
        ...styleOverride,
        ...(underline ? {} : { textDecoration: "none" }),
      }}
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
