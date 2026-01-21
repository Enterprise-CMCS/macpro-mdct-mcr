import { Button } from "@chakra-ui/react";
import { Alert } from "components";
import { ReactNode } from "react";
import { AlertTypes } from "types";

type VariantDisplay = "inline" | "block";

export enum ComponentTypes {
  Button = "Button",
  Alert = "Alert",
}

export const componentDefinitions: {
  type: ComponentTypes;
  description: string;
  variants: ReactNode[];
  display?: VariantDisplay;
}[] = [
  {
    type: ComponentTypes.Button,
    description: "The Button component is used to trigger an action or event.",
    variants: [
      <Button key="primary" variant="primary">
        Primary
      </Button>,
      <Button key="transparent" variant="transparent">
        Transparent
      </Button>,
      <Button key="outline" variant="outline">
        Outline
      </Button>,
      <Button key="link" variant="link">
        Link
      </Button>,
      <Button key="danger" variant="danger">
        Danger
      </Button>,
    ],
    display: "inline",
  },
  {
    type: ComponentTypes.Alert,
    description:
      "The Alert component is used to display important messages to the user.",
    variants: [
      <Alert key="info" description="This is an info alert." />,
      <Alert
        key="warning"
        status={AlertTypes.WARN}
        description="This is a warning alert."
      />,
      <Alert
        key="error"
        status={AlertTypes.ERROR}
        description="This is an error alert."
      />,
      <Alert
        key="error"
        status={AlertTypes.ERROR}
        title="This is the alert title"
        description="This is the alert description"
      />,
    ],
    display: "block",
  },
];
