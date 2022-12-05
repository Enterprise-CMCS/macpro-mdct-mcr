//components
import { Box, Heading } from "@chakra-ui/react";
import { FieldsSubsection } from "components";

export const ExportedReportSection = ({
  section,
}: ExportedReportSectionProps) => {
  return (
    <Box data-testid="fieldsSection" mt="5rem">
      <Heading as="h2" sx={sx.sectionHeading}>
        Section {section.name}
      </Heading>

      {section.children?.map((child, index) => (
        <FieldsSubsection key={child.path + index} content={child} />
      ))}
    </Box>
  );
};

interface ExportedReportSectionProps {
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
    fontSize: "2xl",
    marginBottom: "2xl",
  },
};
