// components
import { Link } from "@chakra-ui/react";

export const SkipNav = ({ id, href, text }: Props) => {
  return (
    <div id={id} tabIndex={-1}>
      <Link sx={sx.skipNavLink} href={href} className="ds-c-skip-nav">
        {text}
      </Link>
    </div>
  );
};

interface Props {
  id: string;
  href: string;
  text: string;
}

const sx = {
  skipNavLink: {
    background: "white",
    position: "absolute",
    top: -100,
    zIndex: "skipLink",
    "&:focus-visible": {
      top: 1,
    },
  },
};
