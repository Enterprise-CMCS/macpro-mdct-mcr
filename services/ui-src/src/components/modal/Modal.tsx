// components
import { Dialog } from "@cmsgov/design-system";
import { Button } from "@chakra-ui/react";
import { makeMediaQueryClasses } from "utils";

export const Modal = ({ actionFunction, dismissFunction, content }: Props) => {
  const mqClasses = makeMediaQueryClasses();
  return (
    <Dialog
      onExit={() => dismissFunction()}
      getApplicationNode={() => document.getElementById("App")}
      heading={content.heading}
      actions={[
        <Button
          className={mqClasses}
          sx={sx.action}
          onClick={() => actionFunction()}
        >
          {content.action}
        </Button>,
        <Button
          className={mqClasses}
          sx={sx.dismiss}
          variant="link"
          onClick={() => dismissFunction()}
        >
          {content.dismiss}
        </Button>,
      ]}
    >
      {content.body}
    </Dialog>
  );
};

interface Props {
  actionFunction: Function;
  dismissFunction: Function;
  content: {
    action: string;
    body: string;
    dismiss: string;
    heading: string;
  };
  [key: string]: any;
}

const sx = {
  action: {
    justifyContent: "start",
    marginTop: "1rem",
    marginBottom: "1rem",
    borderRadius: "0.25rem",
    background: "palette.primary",
    fontWeight: "bold",
    color: "palette.white",
    marginRight: "2rem",
    span: {
      marginLeft: "0.5rem",
      marginRight: "-0.25rem",
    },
    _hover: {
      background: "palette.primary_darker",
    },
    "&.mobile": {
      fontSize: "sm",
    },
  },
  dismiss: {
    justifyContent: "start",
    marginTop: "1rem",
    marginRight: "1rem",
    padding: "0",
    borderRadius: "0.25rem",
    fontWeight: "bold",
    color: "palette.primary",
    textDecoration: "underline",
    span: {
      marginLeft: "0rem",
      marginRight: "0.5rem",
    },
    _hover: {
      textDecoration: "none",
    },
    "&.mobile": {
      fontSize: "sm",
      marginRight: "0",
    },
  },
};
