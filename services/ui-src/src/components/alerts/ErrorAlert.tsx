// components
import { Alert } from "../index";
import { Collapse } from "@chakra-ui/react";
// utils
import { AlertTypes, ErrorData } from "utils/types/types";

export const ErrorAlert = ({
  errorData,
  variant = "inline",
  ...props
}: Props) => {
  return (
    <Collapse in={!!errorData}>
      {errorData && (
        <Alert
          status={AlertTypes.ERROR}
          title={errorData?.name}
          description={errorData?.message}
          showIcon={false}
          className={variant}
          sx={sx.root}
          {...props}
        />
      )}
    </Collapse>
  );
};

interface Props {
  errorData: ErrorData | null;
  variant?: "inline" | "toast";
  [key: string]: any;
}

const sx = {
  root: {
    minHeight: 0,
    marginY: "1rem",
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
