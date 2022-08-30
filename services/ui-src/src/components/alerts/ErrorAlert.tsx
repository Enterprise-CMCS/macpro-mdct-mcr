// components
import { Box, Collapse } from "@chakra-ui/react";
import { Alert } from "components";
import { useRef } from "react";
// utils
import { AlertTypes, AnyObject } from "types";
import { focusElement } from "utils";

export const ErrorAlert = ({
  error,
  variant = "inline",
  sxOverride,
  ...props
}: Props) => {
  // Focus the alert when an error is given
  const ref = useRef<HTMLDivElement>(null);
  if (error && ref.current) {
    focusElement(ref.current);
  }

  return (
    <Box ref={ref} sx={sxOverride}>
      <Collapse in={!!error}>
        {error && (
          <Alert
            status={AlertTypes.ERROR}
            title="Error"
            description={error}
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
  error?: string;
  variant?: "inline" | "toast";
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  root: {
    minHeight: 0,
    marginY: "1rem",
    borderInlineStartWidth: "0.5rem",
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
