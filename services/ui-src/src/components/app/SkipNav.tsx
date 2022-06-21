// components
import { Link } from "@chakra-ui/react";

export const SkipNav = ({ id, href, text, ...props }: Props) => {
  return (
    <div id={id} tabIndex={-1} {...props}>
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
  [key: string]: any;
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
