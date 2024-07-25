// components
import { Box, Collapse } from "@chakra-ui/react";
import { Alert } from "components";
import { useRef } from "react";
// utils
import { AlertTypes, AnyObject, ErrorVerbiage } from "types";

export const ErrorAlert = ({
  error,
  variant = "inline",
  sxOverride,
  ...props
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
            showIcon={false}
            className={variant}
            sx={sx.root}
            {...props}
          />
        )}
      </Collapse>
    </Box>
  );
};

interface Props {
  error?: ErrorVerbiage;
  variant?: "inline" | "toast";
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  root: {
    background: "palette.error_lightest",
    borderLeft: "palette.error",
    minHeight: 0,
    marginY: "1rem",
    maxWidth: "55.25rem",
    margin: "auto",
    borderInlineStartWidth: "0.5rem",
    borderInlineStartColor: "palette.error",
    boxShadow: "0px 4px 3px rgba(0, 0, 0, 0.2)",
    "&.toast": {
      position: "absolute",
      right: 0,
      width: "90%",
      maxWidth: "500px",
      margin: "1rem",
      boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    },
  },
};
