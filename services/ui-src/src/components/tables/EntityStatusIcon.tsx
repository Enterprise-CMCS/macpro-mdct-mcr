// components
import { Box, Image, Text } from "@chakra-ui/react";
// assets
import unfinishedIcon from "assets/icons/icon_error_circle_bright.png";
import unfinishedIconDark from "assets/icons/icon_error_circle.png";
import successIcon from "assets/icons/icon_check_circle.png";
import successIconDark from "assets/icons/icon_check_circle_dark.png";

export const EntityStatusIcon = ({ isComplete, isPdf }: Props) => {
  return (
    <Box sx={sx.container}>
      {isComplete ? (
        <>
          <Image
            sx={sx.statusIcon}
            src={isPdf ? successIconDark : successIcon}
            alt={isPdf ? "" : "complete icon"}
            boxSize="xl"
          />
          {isPdf && (
            <Text sx={sx.successText}>
              <b>Complete</b>
            </Text>
          )}
        </>
      ) : (
        <>
          <Image
            sx={sx.statusIcon}
            src={isPdf ? unfinishedIconDark : unfinishedIcon}
            alt={isPdf ? "" : "warning icon"}
            boxSize="xl"
          />
          {isPdf && (
            <Text sx={sx.errorText}>
              <b>Error</b>
            </Text>
          )}
        </>
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
  override?: boolean;
  [key: string]: any;
}

const sx = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  successText: {
    color: "success_darker",
    fontSize: "0.667rem",
  },
  errorText: {
    color: "error_darker",
    fontSize: "0.667rem",
  },
  statusIcon: {
    marginLeft: "0rem",
    img: {
      maxWidth: "fit-content",
    },
  },
};
