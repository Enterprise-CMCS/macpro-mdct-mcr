import { Grid, GridItem } from "@chakra-ui/react";
import { ExportedReportPage } from "./ExportedReportPage";
import { useStore } from "utils";

export const ExportedReportDiffPage = () => {
  const { previousReport, report } = useStore();

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      <GridItem backgroundColor="gray_lightest" padding="spacer2">
        {previousReport && <ExportedReportPage reportToUse={previousReport} />}
      </GridItem>
      <GridItem padding="spacer2">
        <ExportedReportPage reportToUse={report} />
      </GridItem>
    </Grid>
  );
};
