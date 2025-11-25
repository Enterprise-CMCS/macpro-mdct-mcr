import { MouseEventHandler } from "react";
// components
import { Box, Heading, List, ListItem, Text } from "@chakra-ui/react";
import {
  DrawerReportPageEntityRows,
  ReportPageIntro,
  SaveReturnButton,
} from "components";
// types
import {
  DrawerReportPageShape,
  EntityShape,
  ModalOverlayReportPageShape,
  ReportShape,
} from "types";
// utils
import {
  getMeasureValues,
  getReportVerbiage,
  parseCustomHtml,
  sanitizeAndParseHtml,
} from "utils";
// verbiage
import overlayVerbiage from "verbiage/pages/overlays";

export const EntityDetailsOverlayQualityMeasures = ({
  closeEntityDetailsOverlay,
  report,
  route,
  selectedEntity,
  submitting,
}: Props) => {
  const { qualityMeasuresVerbiage } = getReportVerbiage(report.reportType);
  const { tableHeaders } = qualityMeasuresVerbiage;

  const canAddEntities = true;
  const openDeleteEntityModal = () => {};
  const openRowDrawer = () => {};

  const list = Object.keys(tableHeaders).map((key: string) => {
    const values = getMeasureValues(selectedEntity, key);

    return {
      ariaValues: values.join(" "),
      header: tableHeaders[key],
      values,
    };
  });

  return (
    <>
      <ReportPageIntro text={overlayVerbiage.MCPAR.intro} />
      <Heading as="h2" sx={sx.measureName}>
        {sanitizeAndParseHtml(selectedEntity.measure_name)}
      </Heading>
      <List sx={sx.list}>
        {list.map((listItem: any, index: number) => (
          <ListItem
            aria-label={`${listItem.header} ${listItem.ariaValues}`}
            key={index}
            sx={sx.listItem}
          >
            <Box sx={sx.listHeader}>{listItem.header}</Box>
            <Box sx={sx.listValues}>
              {listItem.values.map((value: string, index: number) => (
                <Text key={`${listItem.header}-${index}`} sx={sx.listValue}>
                  {sanitizeAndParseHtml(value)}
                </Text>
              ))}
            </Box>
          </ListItem>
        ))}
      </List>
      <Heading as="h2" sx={sx.reportTitle}>
        {overlayVerbiage.MCPAR.reportTitle}
      </Heading>
      <Text sx={sx.reportSubtitle}>{overlayVerbiage.MCPAR.reportSubtitle}</Text>
      <Heading as="h3" sx={dashboardTitleStyling(canAddEntities)}>
        {parseCustomHtml(overlayVerbiage.MCPAR.dashboardTitle)}
      </Heading>
      <DrawerReportPageEntityRows
        entities={report.fieldData.plans}
        hasForm={false}
        openRowDrawer={openRowDrawer}
        openDeleteEntityModal={openDeleteEntityModal}
        route={route}
        showStatusText={true}
      />
      <SaveReturnButton
        border={false}
        onClick={closeEntityDetailsOverlay}
        submitting={submitting}
        disabledOnClick={closeEntityDetailsOverlay}
      />
    </>
  );
};

interface Props {
  closeEntityDetailsOverlay: MouseEventHandler;
  report: ReportShape;
  route: DrawerReportPageShape | ModalOverlayReportPageShape;
  selectedEntity: EntityShape;
  submitting?: boolean;
}

function dashboardTitleStyling(canAddEntities: boolean) {
  return {
    borderBottom: "1.5px solid var(--mdct-colors-gray_lighter)",
    color: "gray",
    fontSize: "lg",
    fontWeight: "bold",
    paddingBottom: "0.75rem",
    paddingLeft: canAddEntities && "3.75rem",
  };
}

const sx = {
  list: {
    borderBottom: "1px solid var(--mdct-colors-gray_lighter)",
    paddingBottom: "spacer1",
    marginBottom: "spacer4",
    maxWidth: "608px",
    width: "100%",
  },
  listHeader: {
    fontWeight: "bold",
    marginRight: "spacer3",
    width: "165px",
  },
  listItem: {
    display: "flex",
    fontSize: "sm",
    marginBottom: "spacer3",
  },
  listValues: {
    flex: 1,
  },
  listValue: {
    marginBottom: "spacer1",
  },
  measureName: {
    fontSize: "lg",
    fontWeight: "bold",
    marginBottom: "spacer2",
  },
  reportTitle: {
    fontSize: "xl",
    fontWeight: "bold",
    marginBottom: "spacer2",
  },
  reportSubtitle: {
    fontSize: "md",
    color: "gray",
    marginBottom: "spacer2",
  },
};
