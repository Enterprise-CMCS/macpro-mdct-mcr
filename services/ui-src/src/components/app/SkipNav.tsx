// components
import { Link } from "@chakra-ui/react";
import { AnyObject } from "types";

export const SkipNav = ({ id, href, text, sxOverride, ...props }: Props) => {
  return (
    <div id={id} tabIndex={-1} {...props}>
      <Link
        sx={{ ...sx.skipNavLink, ...sxOverride }}
        href={href}
        className="ds-c-skip-nav"
      >
        {text}
      </Link>
    </div>
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
    background: "palette.white",
    position: "absolute",
    top: -100,
    zIndex: "skipLink",
    "&:focus-visible": {
      top: 1,
    },
  },
};
