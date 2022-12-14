// components
import { Box } from "@chakra-ui/react";
// utils

export const ExportedModalDrawerReportSection = ({
  section,
}: ExportedModalDrawerReportSectionProps) => {
  return <Box>"Modal Drawer Report Section" {section.name}</Box>;
};

interface ExportedModalDrawerReportSectionProps {
  section: any;
}
