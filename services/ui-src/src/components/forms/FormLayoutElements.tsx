// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { labelTextWithOptional, parseCustomHtml } from "utils";

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

export const SectionDivider = () => {
  return <hr className="form-section-break" />;
};

export const SectionContent = ({ content }: SectionContentProps) => {
  return <Text>{content}</Text>;
};

interface SectionContentProps {
  content: string;
}

export const Question = ({ content, hint, styleAsOptional }: QuestionProps) => {
  const sx = {
    wrapper: {
      marginTop: "spacer3",
    },
  };

  const questionContent = styleAsOptional
    ? labelTextWithOptional(content)
    : parseCustomHtml(content);

  return (
    <Box
      sx={sx.wrapper}
      className="question-field ds-c-label ds-c-field__label"
    >
      <Text>{questionContent}</Text>
      {hint && <Text className="ds-c-hint">{parseCustomHtml(hint)}</Text>}
    </Box>
  );
};

interface QuestionProps {
  content: string;
  hint?: string;
  styleAsOptional?: boolean;
}
