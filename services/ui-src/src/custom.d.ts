declare module "@cmsgov/design-system/dist/components/UsaBanner/UsaBanner";
declare module "*.scss";
declare module "*.xlsx";

import { CollapseProps as ChakraCollapseProps } from "@chakra-ui/react";
import { ReactNode } from "react";

declare module "@chakra-ui/react" {
  export interface CollapseProps extends ChakraCollapseProps {
    children?: ReactNode;
  }
}
