// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { parseCustomHtml } from "utils";

export const SectionHeader = ({
  content,
  divider,
  hint,
}: SectionHeaderProps) => {
  const sx = {
    h3: {
      marginTop: "spacer4",
      paddingY: "spacer2",
      borderTop: divider === "top" ? "1px" : "0",
      borderBottom: divider === "bottom" ? "1px" : "0",
      borderColor: "gray_lighter",
    },
    hintText: {
      fontSize: "sm",
      color: "gray_dark",
      marginBottom: "spacer2",
    },
  };
  return (
    <Box sx={sx}>
      <Heading as="h3" size="md">
        {content}
      </Heading>
      {hint && <Text sx={sx.hintText}>{parseCustomHtml(hint)}</Text>}
    </Box>
  );
};

interface SectionHeaderProps {
  content: string;
  divider: "top" | "bottom" | "none";
  hint?: string;
}

export const SectionContent = ({ content }: SectionContentProps) => {
  return <Text>{content}</Text>;
};

interface SectionContentProps {
  content: string;
}
