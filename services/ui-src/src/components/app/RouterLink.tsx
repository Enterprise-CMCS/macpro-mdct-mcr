import { ReactChild } from "react";
import { Link } from "react-router-dom";

export const RouterLink = ({
  to,
  alt,
  tabindex,
  underline,
  children,
}: Props) => {
  return (
    <Link
      to={to}
      title={alt}
      tabIndex={tabindex}
      style={underline ? {} : { textDecoration: "none" }}
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
  children?: ReactChild | ReactChild[];
}
