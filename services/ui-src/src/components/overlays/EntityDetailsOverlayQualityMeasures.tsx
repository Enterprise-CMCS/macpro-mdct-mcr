import { MouseEventHandler } from "react";
// components
import { Heading, List, ListItem, Text } from "@chakra-ui/react";
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

  const getValue = (entity: EntityShape, key: string) => {
    const value = entity[key];
    if (Array.isArray(value)) return value[0].value;
    return value;
  };

  const list = Object.keys(tableHeaders).map((key: string) => ({
    header: tableHeaders[key],
    value: getValue(selectedEntity, key),
  }));

  return (
    <>
      <ReportPageIntro text={overlayVerbiage.MCPAR.intro} />
      <Heading as="h2" sx={sx.measureName}>
        {sanitizeAndParseHtml(selectedEntity.measure_name)}
      </Heading>
      <List sx={sx.list}>
        {list.map((listItem: any, index: number) => (
          <ListItem
            aria-label={`${listItem.header} ${sanitizeAndParseHtml(
              listItem.value
            )}`}
            key={index}
            sx={sx.listItem}
          >
            <Text sx={sx.listHeader}>{listItem.header}</Text>
            <Text sx={sx.listValue}>
              {sanitizeAndParseHtml(listItem.value)}
            </Text>
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
  listValue: {
    flex: 1,
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
