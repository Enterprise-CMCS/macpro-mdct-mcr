//components
import { Box, Heading } from "@chakra-ui/react";
import { FieldsSubsection } from "components";

export const FieldsSection = ({ section }: FieldsSectionProps) => {
  return (
    <Box data-testid="fieldsSection" mt="5rem">
      <Heading as="h2" sx={sx.sectionHeading}>
        Section {section.name}
      </Heading>

      {section.children?.map((child, index) => {
        return <FieldsSubsection key={child.path + index} content={child} />;
      })}
    </Box>
  );
};

interface FieldsSectionProps {
  section: {
    path: string;
    name: string;
    pageType?: string;
    children?: any[];
  };
}

const sx = {
  sectionHeading: {
    fontWeight: "bold",
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
  },
};
