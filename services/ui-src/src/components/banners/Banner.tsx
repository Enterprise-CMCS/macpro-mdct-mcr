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
  description,
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
      <AlertIcon sx={sx.alertIcon} />
      <Flex flexDirection="column">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Flex>
    </Alert>
  );
};

interface Props {
  status: BannerTypes;
  title: string;
  description: string;
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
    color: "palette.gray_darkest",
    marginBottom: "1.75rem",
  },
};
