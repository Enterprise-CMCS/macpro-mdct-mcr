// components
import { Link } from "@chakra-ui/react";
import { AnyObject } from "types";

export const SkipNav = ({ id, href, text, sxOverride, ...props }: Props) => {
  return (
    <Link
      // tabIndex={-1}
      id={id}
      sx={{ ...sx.skipNavLink, ...sxOverride }}
      href={href}
      className="ds-c-skip-nav"
      onClick={() => {
        // remove initial "#" from href string
        const targetElementId = href.substring(1);
        const targetElement: HTMLElement =
          document.getElementById(targetElementId)!;
        targetElement?.focus({ preventScroll: true });
      }}
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
    background: "palette.white",
    zIndex: "skipLink",
    // transition: "all 0s !important",
    "&:focus-visible": {
      top: 1,
    },
  },
};
