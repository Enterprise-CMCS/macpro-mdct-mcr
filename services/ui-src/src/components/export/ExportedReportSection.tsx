// components
import { Box, Heading } from "@chakra-ui/react";
import { ExportedReportWrapper } from "components";
// utils
import { PageTypes, ReportRoute, ReportRouteWithForm } from "types";

export const ExportedReportSection = ({ section }: Props) => {
  return (
    <Box data-testid="fieldsSection" mt="5rem">
      {section?.pageType !== PageTypes.REVIEW_SUBMIT && (
        <Heading as="h2" sx={sx.sectionHeading}>
          Section {section.name}
        </Heading>
      )}
      {/* render report sections */}
      <RecursiveReportSection section={section} />
    </Box>
  );
};

const RecursiveReportSection = ({ section }: Props) => (
  <Box>
    {/* if section has children, recurse */}
    {section?.children?.map((child) => (
      <RecursiveReportSection key={section.name} section={child} />
    ))}
    {/* if section does not have children, render it */}
    {!section?.children && (
      <ExportedReportWrapper
        key={section.path}
        section={section as ReportRouteWithForm}
      />
    )}
  </Box>
);

interface Props {
  section: ReportRoute;
}

const sx = {
  sectionHeading: {
    fontWeight: "bold",
    fontSize: "2xl",
    marginBottom: "2xl",
  },
};
