// components
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
} from "@chakra-ui/react";
// utils
import { BannerTypes } from "utils/types/types";

export const Banner = ({
  status,
  bgColor,
  accentColor,
  title,
  body,
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
        <AlertIcon sx={sx.alertIcon} />
        <Flex sx={sx.alertContent}>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{body}</AlertDescription>
        </Flex>
      </Flex>
    </Alert>
  );
};

interface Props {
  status: BannerTypes;
  title: string;
  body: string;
  bgColor?: string;
  accentColor?: string;
}

const sx = {
  root: {
    minHeight: "5.25rem",
    borderInlineStartWidth: "0.5rem",
    marginTop: "1.25rem",
  },
  alertIcon: {
    position: "absolute",
    color: "palette.gray_darkest",
    marginBottom: "1.75rem",
  },
  alertContent: {
    flexDirection: "column",
    marginLeft: "2rem",
  },
};
