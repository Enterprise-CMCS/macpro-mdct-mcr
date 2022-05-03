// components
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
} from "@chakra-ui/react";

// Make alert banner and pass in status and color, text,
export const Banner = ({
  // status,
  bgColor,
  accentColor,
  title,
  description,
}: Props) => {
  return (
    <Alert
      sx={sx.root}
      // status={status}
      status="info"
      variant="left-accent"
      bg={bgColor}
      borderInlineStartColor={accentColor}
      data-testid="banner"
    >
      <AlertIcon color={"palette.gray_darkest"} />
      <Flex flexDirection="column">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Flex>
    </Alert>
  );
};

// todo figure out how to pass status which is an enum from Chakra
interface Props {
  // status: string or something;
  bgColor: string;
  accentColor: string;
  title: string;
  description: string;
}

const sx = {
  root: {
    height: "5.25rem",

    borderInlineStartWidth: "0.5rem",
    marginTop: "1.25rem",
    marginBottom: "2.5rem",
  },
};
