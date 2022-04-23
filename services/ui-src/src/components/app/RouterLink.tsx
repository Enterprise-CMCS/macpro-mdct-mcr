import { ReactChild } from "react";
import { Link } from "react-router-dom";

export const RouterLink = ({ to, alt, underline, children }: Props) => {
  return (
    <Link
      to={to}
      title={alt}
      style={underline ? {} : { textDecoration: "none" }}
    >
      {children}
    </Link>
  );
};

interface Props {
  to: string;
  alt: string;
  underline?: boolean;
  children?: ReactChild | ReactChild[];
}
