import { MouseEventHandler } from "react";
// components
import { Button, Image } from "@chakra-ui/react";
// assets
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";

export const BackButton = ({ onClick, ariaLabel, text }: Props) => {
  return (
    <Button
      sx={sx.backButton}
      variant="none"
      onClick={onClick}
      aria-label={ariaLabel || text}
    >
      <Image src={arrowLeftBlue} alt="Arrow left" sx={sx.backIcon} />
      {text}
    </Button>
  );
};

interface Props {
  onClick?: MouseEventHandler;
  ariaLabel?: string;
  text?: string;
}

const sx = {
  backButton: {
    padding: 0,
    fontWeight: "normal",
    color: "palette.primary",
    display: "flex",
    position: "relative",
    right: "3rem",
    marginBottom: "2rem",
    marginTop: "-2rem",
  },
  backIcon: {
    color: "palette.primary",
    height: "1rem",
    marginRight: "0.5rem",
  },
};
