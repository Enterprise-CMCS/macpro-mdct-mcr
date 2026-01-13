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
    borderInlineStartWidth: "spacer1",
    padding: "spacer2",
    margin: "1.25rem auto 2.5rem",
    "&.info": {
      backgroundColor: "secondary_lightest",
      borderInlineStartColor: "secondary",
    },
    "&.success": {
      bgColor: "success_lightest",
      borderInlineStartColor: "success",
    },
    "&.warning": {
      bgColor: "warn_lightest",
      borderInlineStartColor: "warn",
    },
    "&.error": {
      bgColor: "error_lightest",
      borderInlineStartColor: "error",
    },
  },
  descriptionText: {
    marginTop: "spacer_half",
  },
  linkText: {
    marginTop: "spacer_half",
    marginBottom: "spacer_half",
  },
  icon: {
    position: "absolute",
    color: "base",
    marginTop: "0",
    marginBottom: "1.75rem",
    width: "1.5rem",
  },
  contentBox: {
    marginLeft: "spacer4",
    "&.no-icon": {
      marginLeft: 0,
    },
  },
};
