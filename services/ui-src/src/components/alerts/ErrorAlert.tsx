// components
import { Alert } from "../index";
import { Collapse } from "@chakra-ui/react";
// utils
import { AlertTypes, ErrorData, StyleObject } from "utils/types/types";

export const ErrorAlert = ({
  error,
  variant = "inline",
  sxOverrides,
  ...props
}: Props) => {
  return (
    <Collapse in={!!error}>
      {error && (
        <Alert
          status={AlertTypes.ERROR}
          title={error?.name}
          description={error?.message}
          showIcon={false}
          className={variant}
          sx={{ ...sx.root, ...sxOverrides }}
          {...props}
        />
      )}
    </Collapse>
  );
};

interface Props {
  error: ErrorData | null;
  variant?: "inline" | "toast";
  sxOverrides?: StyleObject;
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
