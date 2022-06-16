// components
import {
  Alert as AlertRoot,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Link,
  Text,
} from "@chakra-ui/react";
// utils
import { AlertTypes } from "utils/types/types";

export const Alert = ({
  status = AlertTypes.INFO,
  title,
  description,
  link,
  showIcon = true,
  ...props
}: Props) => {
  return (
    <AlertRoot
      status={status}
      variant="left-accent"
      sx={sx.root}
      className={status}
      {...props}
    >
      <Flex>
        {showIcon && <AlertIcon sx={sx.icon} />}
        <Box sx={sx.contentBox} className={!showIcon ? "no-icon" : ""}>
          {title && <AlertTitle>{title}</AlertTitle>}
          {description && (
            <AlertDescription>
              <Text>{description}</Text>
              {link && (
                <Text>
                  <Link href={link} isExternal variant="inline">
                    {link}
                  </Link>
                </Text>
              )}
            </AlertDescription>
          )}
        </Box>
      </Flex>
    </AlertRoot>
  );
};

interface Props {
  status?: AlertTypes;
  title?: string;
  description?: string;
  link?: string;
  showIcon?: boolean;
  [key: string]: any;
}

const sx = {
  root: {
    alignItems: "start",
    minHeight: "5.25rem",
    borderInlineStartWidth: "0.5rem",
    marginTop: "1.25rem",
    "&.info": {
      backgroundColor: "palette.alt_lightest",
      borderInlineStartColor: "palette.alt",
    },
    "&.success": {
      bgColor: "palette.success_lightest",
      borderInlineStartColor: "palette.success",
    },
    "&.warning": {
      bgColor: "palette.warn_lightest",
      borderInlineStartColor: "palette.warn",
    },
    "&.error": {
      bgColor: "palette.error_lightest",
      borderInlineStartColor: "palette.error",
    },
  },
  icon: {
    position: "absolute",
    color: "palette.gray_darkest",
    marginBottom: "1.75rem",
  },
  contentBox: {
    marginLeft: "2rem",
    "&.no-icon": {
      marginLeft: 0,
    },
  },
};
