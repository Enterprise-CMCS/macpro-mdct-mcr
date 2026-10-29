// components
import { Box, Flex, Heading, Link } from "@chakra-ui/react";
import { Alert as AlertRoot } from "@cmsgov/design-system";
import { ReactNode } from "react";
// types
import { AlertTypes, CustomHtmlElement } from "types";
// utils
import { parseCustomHtml } from "utils";

export const Alert = ({
  status,
  title,
  children,
  description,
  link,
  className,
}: Props) => {
  const content = description ? parseCustomHtml(description) : children;
  return (
    <AlertRoot variation={status} className={className}>
      <Flex>
        <Box sx={sx.contentBox}>
          {title && (
            <Heading as="h1" sx={sx.title}>
              {title}
            </Heading>
          )}
          {content && (
            <>
              <Box sx={sx.descriptionText}>{content}</Box>
              {link && (
                <Link href={link} isExternal>
                  {link}
                </Link>
              )}
            </>
          )}
        </Box>
      </Flex>
    </AlertRoot>
  );
};

interface Props {
  status?: AlertTypes;
  title?: string;
  children?: ReactNode;
  description?: string | CustomHtmlElement[];
  link?: string;
  className?: string;
}

const sx = {
  title: {
    fontSize: "heading_lg",
  },
  descriptionText: {
    marginTop: "spacer_half",
    a: {
      color: "primary",
      ":hover": {
        color: "primary_darker",
        textDecorationColor: "primary_darker",
      },
    },
  },
  contentBox: {
    marginLeft: "spacer2",
  },
};
