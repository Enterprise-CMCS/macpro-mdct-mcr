// components
import { Alert } from "../index";
import { Box, Collapse } from "@chakra-ui/react";
// utils
import { AlertTypes, StyleObject } from "utils/types/types";

export const ErrorAlert = ({
  error,
  variant = "inline",
  sxOverrides,
  ...props
}: Props) => {
  return (
    <Box sx={sxOverrides}>
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
