import { useRef } from "react";
// components
import { Box, Collapse, SystemStyleObject } from "@chakra-ui/react";
import { Alert } from "components";
// types
import { AlertTypes, ErrorVerbiage } from "types";

export const ErrorAlert = ({
  error,
  variant = "inline",
  sxOverride,
  showIcon = false,
}: Props) => {
  // Focus the alert when an error is given
  const ref = useRef<HTMLDivElement>(null);
  if (error && ref.current) {
    ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    ref.current.focus({ preventScroll: true });
  }

  return (
    <Box ref={ref} sx={sxOverride}>
      <Collapse in={!!error}>
        {error && (
          <Alert
            status={AlertTypes.ERROR}
            title={error.title}
            description={error.description}
            showIcon={showIcon}
            className={variant}
            sxOverride={{ ...sx.root, ...sxOverride }}
          />
        )}
      </Collapse>
    </Box>
  );
};

interface Props {
  error?: ErrorVerbiage;
  variant?: "inline" | "toast";
  sxOverride?: SystemStyleObject;
  [key: string]: any;
}

const sx = {
  root: {
    background: "error_lightest",
    borderLeft: "error",
    minHeight: 0,
    marginY: "spacer2",
    maxWidth: "55.25rem",
    margin: "auto",
    borderInlineStartWidth: "0.5rem",
    borderInlineStartColor: "error",
    boxShadow: "0px 4px 3px rgba(0, 0, 0, 0.2)",
    "&.toast": {
      position: "absolute",
      right: 0,
      width: "90%",
      maxWidth: "500px",
      margin: "spacer2",
      boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    },
  },
};
