import React, { MouseEventHandler, useEffect } from "react";
// components
import { Box } from "@chakra-ui/react";
import {
  BackButton,
  EntityDetailsOverlayQualityMeasures,
  EntityDetailsOverlayReporting,
} from "components";
// types
import {
  EntityShape,
  FormJson,
  EntityType,
  ReportType,
  ModalOverlayReportPageShape,
  ReportShape,
  DrawerReportPageShape,
} from "types";
// utils
import { useStore } from "utils";
// verbiage
import overlayVerbiage from "verbiage/pages/overlays";

export const EntityDetailsOverlay = (props: EntityDetailsOverlayProps) => {
  const {
    closeEntityDetailsOverlay,
    entities,
    entityType,
    report,
    route,
    selectedEntity,
    setEntering,
  } = props;

  // Entity Provider Setup
  const { setEntities, setSelectedEntity, setEntityType } = useStore();

  useEffect(() => {
    setEntering(false);
  }, []);

  useEffect(() => {
    setSelectedEntity(selectedEntity);
    setEntityType(entityType);
    setEntities(entities);
    return () => {
      setEntities([]);
      setSelectedEntity(undefined);
    };
  }, [entityType, selectedEntity]);

  const reportType = report.reportType as ReportType;

  const backButtonText = (reportType: ReportType) => {
    const key = reportType as keyof typeof overlayVerbiage;
    return overlayVerbiage[key]?.backButton || "Return";
  };

  const SwitchOverlay = (props: EntityDetailsOverlayProps) => {
    if (
      reportType === ReportType.MCPAR &&
      route.path ===
        "/mcpar/plan-level-indicators/quality-measures/measures-and-results"
    ) {
      return <EntityDetailsOverlayQualityMeasures {...props} />;
    }

    if (reportType === ReportType.MLR) {
      return <EntityDetailsOverlayReporting {...props} />;
    }

    return <></>;
  };

  return (
    <Box>
      <BackButton
        onClick={closeEntityDetailsOverlay}
        text={backButtonText(reportType)}
      />
      <SwitchOverlay {...props} />
    </Box>
  );
};

export interface EntityDetailsOverlayProps {
  closeEntityDetailsOverlay: MouseEventHandler;
  entityType: EntityType;
  disabled: boolean;
  entities: EntityShape[];
  drawerForm?: FormJson;
  form?: FormJson;
  onSubmit: Function;
  report: ReportShape;
  route: DrawerReportPageShape | ModalOverlayReportPageShape;
  selectedEntity: EntityShape;
  setEntering: Function;
  submitting?: boolean;
  validateOnRender?: boolean;
}
