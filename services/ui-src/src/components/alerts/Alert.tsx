// components
import {
  Alert as AlertRoot,
  AlertDescription,
  AlertTitle,
  Box,
  Flex,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
// types
import { AlertTypes, CustomHtmlElement } from "types";
// utils
import { parseCustomHtml } from "utils";
// assets
import alertIcon from "assets/icons/icon_info_circle.png";
import warningIcon from "assets/icons/icon_warning.png";
import errorIcon from "assets/icons/icon_alert_circle.png";

export const Alert = ({
  status,
  title,
  description,
  link,
  showIcon = true,
  sxOverride,
  className,
}: Props) => {
  return (
    <AlertRoot
      status={status}
      variant="left-accent"
      sx={{ ...sx.root, ...sxOverride }}
      className={className || status}
    >
      <Flex>
        {showIcon && (
          <Image
            src={
              status === AlertTypes.WARNING
                ? warningIcon
                : status === AlertTypes.ERROR
                ? errorIcon
                : alertIcon
            }
            sx={sx.icon}
            alt={status || "alert"}
          />
        )}
        <Box sx={sx.contentBox} className={!showIcon ? "no-icon" : ""}>
          {title && <AlertTitle>{title}</AlertTitle>}
          {description && (
            <AlertDescription>
              <Text sx={sx.descriptionText}>
                {parseCustomHtml(description)}
              </Text>
              {link && (
                <Text sx={sx.linkText}>
                  <Link href={link} isExternal>
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
  description?: string | CustomHtmlElement[];
  link?: string;
  showIcon?: boolean;
  [key: string]: any;
}

const sx = {
  root: {
    alignItems: "start",
    minHeight: "5.25rem",
    borderInlineStartWidth: "0.5rem",
    padding: "1rem",
    margin: "1.25rem auto 2.5rem",
    "&.info": {
      backgroundColor: "palette.secondary_lightest",
      borderInlineStartColor: "palette.secondary",
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
  descriptionText: {
    marginTop: ".25rem",
  },
  linkText: {
    marginTop: ".25rem",
    marginBottom: ".25rem",
  },
  icon: {
    position: "absolute",
    color: "palette.base",
    marginTop: "0",
    marginBottom: "1.75rem",
    width: "1.5rem",
  },
  contentBox: {
    marginLeft: "2rem",
    "&.no-icon": {
      marginLeft: 0,
    },
  },
};
