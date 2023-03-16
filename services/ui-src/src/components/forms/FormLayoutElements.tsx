import { Box } from "@chakra-ui/react";

export const SectionHeader = ({ content, divider, ...props }: Props) => {
  return (
    <Box sx={sx} {...props}>
      {divider === "top" && <hr></hr>}
      <h3>{content}</h3>
      {divider === "bottom" && <hr></hr>}
    </Box>
  );
};

interface Props {
  content: string;
  divider: "top" | "bottom" | "none";
  [key: string]: any;
}

const sx = {
  h3: {
    padding: "2rem 0 1rem 0",
  },
};
