//components
import { Box, Heading } from "@chakra-ui/react";
import { FieldsSubsection } from "components";

const FieldsSection = ({ section }: FieldsSectionProps) => {
  return (
    <Box data-testid="fieldsSection" mt="5rem" key={section.path}>
      <Heading as="h2" sx={sx.sectionHeading}>
        {`Section ${section.name}`}
      </Heading>

      {section.children?.map((child, index) => {
        return <FieldsSubsection key={child.path + index} content={child} />;
      })}
    </Box>
  );
};

export { FieldsSection };

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
