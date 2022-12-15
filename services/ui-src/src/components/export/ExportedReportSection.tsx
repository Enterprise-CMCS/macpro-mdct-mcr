// components
import { Box, Heading } from "@chakra-ui/react";
import { ExportedReportWrapper } from "components";
// utils
import { FormJson, ReportPageVerbiage, ReportRouteBase } from "types";

export const ExportedReportSection = ({
  section,
}: ExportedReportSectionProps) => {
  return (
    <Box data-testid="fieldsSection" mt="5rem">
      <Heading as="h2" sx={sx.sectionHeading}>
        Section {section.name}
      </Heading>
      <RecursiveReportSection section={section} />
    </Box>
  );
};

const RecursiveReportSection = ({ section }: RecursiveReportSectionProps) => {
  return (
    <Box>
      {section?.children?.map((child, index) => {
        return (
          <RecursiveReportSection key={section.path + index} section={child} />
        );
      })}
      {!section?.children && (
        <ExportedReportWrapper key={section.path} section={section} />
      )}
    </Box>
  );
};

interface SectionProps extends ReportRouteBase {
  children?: any[];
}

interface ExportedReportSectionProps {
  section: SectionProps;
}

interface RecursiveReportSectionProps {
  section: {
    children?: any[];
    name: string;
    path: string;
    form?: FormJson;
    verbiage?: ReportPageVerbiage;
  };
}

const sx = {
  sectionHeading: {
    fontWeight: "bold",
    fontSize: "2xl",
    marginBottom: "2xl",
  },
};
