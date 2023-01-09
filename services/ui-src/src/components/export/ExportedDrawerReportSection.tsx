// components
import { Box } from "@chakra-ui/react";
import { ExportedSectionHeading, ExportedReportFieldTable } from "components";
// types, utils
import { DrawerReportPageShape } from "types";

export const ExportedDrawerReportSection = ({
  section,
  section: { drawerForm, name, verbiage },
}: Props) => {
  const sectionHeading = verbiage?.intro.subsection || name;

  const formFields = drawerForm.fields;

  return (
    <Box data-testid="exportedDrawerReportSection" mt="2rem">
      {sectionHeading && (
        <ExportedSectionHeading heading={sectionHeading} verbiage={verbiage} />
      )}
      {formFields && <ExportedReportFieldTable section={section} />}
    </Box>
  );
};

export interface Props {
  section: DrawerReportPageShape;
}
