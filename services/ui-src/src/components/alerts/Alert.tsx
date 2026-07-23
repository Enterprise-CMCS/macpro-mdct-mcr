// components
import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
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
  return (
    <AlertRoot variation={status} className={className}>
      <Flex>
        <Box sx={sx.contentBox}>
          {title && (
            <Heading as="h1" sx={sx.title}>
              {title}
            </Heading>
          )}
          {description ? (
            <>
              <Text sx={sx.descriptionText}>
                {parseCustomHtml(description)}
              </Text>
              {link && (
                <Link href={link} isExternal>
                  {link}
                </Link>
              )}
            </>
          ) : (
            children && (
              <>
                <Text sx={sx.descriptionText}>{children}</Text>
                {link && (
                  <Link href={link} isExternal>
                    {link}
                  </Link>
                )}
              </>
            )
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
    fontSize: "lg",
  },
  descriptionText: {
    marginTop: "spacer_half",
  },
  contentBox: {
    marginLeft: "spacer2",
  },
};
