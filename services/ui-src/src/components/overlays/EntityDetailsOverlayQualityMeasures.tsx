// components
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { DrawerReportPageEntityRows } from "components";
// types
import {
  DrawerReportPageShape,
  EntityShape,
  ModalOverlayReportPageShape,
  ReportShape,
} from "types";
// utils
import { getReportVerbiage } from "utils";
// verbiage
import overlayVerbiage from "verbiage/pages/overlays";

export const EntityDetailsOverlayQualityMeasures = ({
  report,
  route,
  selectedEntity,
}: Props) => {
  const { qualityMeasuresVerbiage } = getReportVerbiage(report.reportType);
  const { tableHeaders } = qualityMeasuresVerbiage;
  const headers = Object.keys(tableHeaders).map((key) => tableHeaders[key]);

  const openDeleteEntityModal = () => {};
  const openRowDrawer = () => {};

  return (
    <>
      <Heading>{selectedEntity.measure_name}</Heading>
      <Flex>
        <Box>
          {headers.map((header: string, index: number) => (
            <Text key={index}>{header}</Text>
          ))}
        </Box>
        <Box>
          <Text>{selectedEntity.measure_identifierCmit}</Text>
          <Text>{selectedEntity.measure_dataVersion?.[0].value}</Text>
          <Text>{selectedEntity.measure_activities?.[0].value}</Text>
        </Box>
      </Flex>
      <Box>
        <Heading as="h3" sx={sx.dashboardTitle}>
          {overlayVerbiage.MCPAR.dashboardTitle}
        </Heading>
        <Text sx={sx.dashboardSubtitle}>
          {overlayVerbiage.MCPAR.dashboardSubtitle}
        </Text>
      </Box>
      <DrawerReportPageEntityRows
        entities={report.fieldData.plans}
        hasForm={false}
        openRowDrawer={openRowDrawer}
        openDeleteEntityModal={openDeleteEntityModal}
        route={route}
      />
    </>
  );
};

interface Props {
  report: ReportShape;
  route: DrawerReportPageShape | ModalOverlayReportPageShape;
  selectedEntity: EntityShape;
}

const sx = {
  dashboardTitle: {
    fontSize: "xl",
    fontWeight: "bold",
  },
  dashboardSubtitle: {
    fontSize: "md",
    color: "gray",
  },
};
