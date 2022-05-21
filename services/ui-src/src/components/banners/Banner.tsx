// components
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  Link,
  Text,
} from "@chakra-ui/react";
// utils
import { BannerTypes } from "utils/types/types";

export const Banner = ({
  status,
  bgColor,
  accentColor,
  title,
  description,
  link,
}: Props) => {
  return (
    <Alert
      sx={sx.root}
      status={status}
      variant="left-accent"
      bg={bgColor}
      borderInlineStartColor={accentColor}
      data-testid="banner"
    >
      <Flex>
        <AlertIcon sx={sx.icon} />
        <Flex sx={sx.contentFlex}>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>
            <Text>{description}</Text>
            {link && (
              <Text sx={sx.descriptionLink}>
                <Link href="https://chakra-ui.com" isExternal variant="inline">
                  {link}
                </Link>
              </Text>
            )}
          </AlertDescription>
        </Flex>
      </Flex>
    </Alert>
  );
};

interface Props {
  status: BannerTypes;
  title: string;
  description: string;
  link?: string;
  bgColor?: string;
  accentColor?: string;
}

const sx = {
  root: {
    minHeight: "5.25rem",
    borderInlineStartWidth: "0.5rem",
    marginTop: "1.25rem",
  },
  icon: {
    position: "absolute",
    color: "palette.gray_darkest",
    marginBottom: "1.75rem",
  },
  contentFlex: {
    flexDirection: "column",
    marginLeft: "2rem",
  },
  descriptionLink: {
    // color: "palette.main",
  },
};
