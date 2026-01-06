// components
import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { Alert as AlertRoot } from "@cmsgov/design-system";
// types
import { AlertTypes, CustomHtmlElement } from "types";
// utils
import { parseCustomHtml } from "utils";

export const Alert = ({
  status,
  title,
  description,
  link,
  className,
}: Props) => {
  return (
    <AlertRoot variation={status} className={className || status}>
      <Flex>
        <Box sx={sx.contentBox}>
          {title && (
            <Heading as="h3" sx={sx.title}>
              {title}
            </Heading>
          )}
          {description && (
            <>
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
  description?: string | CustomHtmlElement[];
  link?: string;
  [key: string]: any;
}

const sx = {
  root: {
    alignItems: "start",
    minHeight: "5.25rem",
    borderInlineStartWidth: "spacer1",
    padding: "spacer2",
    margin: "1.25rem auto 2.5rem",
  },
  title: {
    fontSize: "lg",
  },
  descriptionText: {
    marginTop: "spacer_half",
  },
  linkText: {
    marginTop: "spacer_half",
    marginBottom: "spacer_half",
  },
  contentBox: {
    marginLeft: "spacer2",
  },
};
