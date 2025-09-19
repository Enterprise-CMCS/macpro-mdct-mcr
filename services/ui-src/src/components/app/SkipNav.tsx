// components
import { Link, SystemStyleObject } from "@chakra-ui/react";
// types

export const SkipNav = ({ id, href, text, sxOverride, ...props }: Props) => {
  return (
    <Link
      id={id}
      sx={{ ...sx.skipNavLink, ...sxOverride }}
      href={href}
      className="ds-c-skip-nav"
      {...props}
    >
      {text}
    </Link>
  );
};

interface Props {
  id: string;
  href: string;
  text: string;
  sxOverride?: SystemStyleObject;
  [key: string]: any;
}

const sx = {
  skipNavLink: {
    zIndex: "skipLink",
    minWidth: "200px",
    background: "white",
    transition: "all 0s !important",
    "&:focus-visible": {
      top: 1,
    },
  },
};
