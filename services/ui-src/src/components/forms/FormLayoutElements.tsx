// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { parseCustomHtml } from "utils";

export const SectionHeader = ({
  content,
  divider,
  hint,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  autosave,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validateOnRender,
  ...props
}: SectionHeaderProps) => {
  const sx = {
    hr: {
      marginTop: "2rem",
      paddingBottom: "1rem",
      borderColor: "palette.gray_lighter",
    },
    h3: {
      padding: divider === "bottom" ? "2rem 0 1rem 0" : "2rem 0 2rem 0",
    },
    hintText: {
      fontSize: "sm",
      color: "palette.gray",
      paddingTop: "1rem",
    },
  };
  return (
    <Box sx={sx} {...props}>
      {divider === "top" && <hr></hr>}
      <Heading size="md">{content}</Heading>
      {hint && <Text sx={sx.hintText}>{parseCustomHtml(hint)}</Text>}
      {divider === "bottom" && <hr></hr>}
    </Box>
  );
};

interface SectionHeaderProps {
  content: string;
  divider: "top" | "bottom" | "none";
  hint?: string;
  [key: string]: any;
}

export const SectionContent = ({ content }: SectionContentProps) => {
  const sx = {
    paddingTop: "0.5rem",
  };
  return <Text sx={sx}>{content}</Text>;
};

interface SectionContentProps {
  content: string;
  [key: string]: any;
}
