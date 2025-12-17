// components
import { Box, Image, Text } from "@chakra-ui/react";
// assets
import unfinishedIcon from "assets/icons/icon_error_circle_bright.png";
import unfinishedIconDark from "assets/icons/icon_error_circle.png";
import successIcon from "assets/icons/icon_check_circle.png";
import successIconDark from "assets/icons/icon_check_circle_dark.png";

export const EntityStatusIcon = ({ isComplete, isPdf }: Props) => {
  const iconSrc = isComplete
    ? isPdf
      ? successIconDark
      : successIcon
    : isPdf
    ? unfinishedIconDark
    : unfinishedIcon;

  const altText = isPdf ? "" : isComplete ? "complete icon" : "warning icon";
  const pdfLabelText = isComplete ? "Complete" : "Error";
  return (
    <Box sx={sx.container}>
      <Image sx={sx.statusIcon} src={iconSrc} alt={altText} boxSize="xl" />
      {isPdf && (
        <Text
          sx={sx.pdfLabelText}
          color={isComplete ? "success_darker" : "error_darker"}
        >
          {pdfLabelText}
        </Text>
      )}
    </Box>
  );
};

interface Props {
  isComplete: boolean;
  /**
   * Whether or not icon is appearing on PDF page (used for styling)
   */
  isPdf?: boolean;
}

const sx = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  pdfLabelText: {
    fontSize: "0.667rem",
    fontWeight: "bold",
  },
  statusIcon: {
    marginLeft: "0rem",
    img: {
      maxWidth: "fit-content",
    },
  },
};
