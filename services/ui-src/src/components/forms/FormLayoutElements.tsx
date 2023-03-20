import { Box } from "@chakra-ui/react";

export const SectionHeader = ({ content, divider, ...props }: Props) => {
  const sx = {
    h3: {
      padding: divider === "bottom" ? "2rem 0 1rem 0" : "1rem 0 2rem 0",
    },
  };
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
