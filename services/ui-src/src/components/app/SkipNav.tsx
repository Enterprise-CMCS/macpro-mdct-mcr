// components
import { Link } from "@chakra-ui/react";
import { AnyObject } from "types";

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
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  skipNavLink: {
    zIndex: "skipLink",
    minWidth: "200px",
    background: "palette.white",
    transition: "all 0s !important",
    "&:focus-visible": {
      top: 1,
    },
  },
};
