import { Box, Heading, Text } from "@chakra-ui/react";

export const SectionHeader = ({
  content,
  divider,
  ...props
}: SectionHeaderProps) => {
  const sx = {
    h3: {
      padding: divider === "bottom" ? "2rem 0 1rem 0" : "1rem 0 2rem 0",
    },
  };
  return (
    <Box sx={sx} {...props}>
      {divider === "top" && <hr></hr>}
      <Heading size="md">{content}</Heading>
      {divider === "bottom" && <hr></hr>}
    </Box>
  );
};

interface SectionHeaderProps {
  content: string;
  divider: "top" | "bottom" | "none";
  [key: string]: any;
}

export const SectionContent = ({ content }: SectionContentProps) => {
  return <Text>{content}</Text>;
};

interface SectionContentProps {
  content: string;
  [key: string]: any;
}
