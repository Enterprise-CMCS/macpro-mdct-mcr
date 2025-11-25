import { MouseEventHandler, useEffect } from "react";
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
import { routeChecker, useStore } from "utils";
// verbiage
import overlayVerbiage from "verbiage/pages/overlays";

export const EntityDetailsOverlay = ({
  closeEntityDetailsOverlay,
  disabled,
  entities,
  entityType,
  form = {} as FormJson,
  onSubmit,
  report,
  route,
  selectedEntity,
  submitting,
  setEntering,
  validateOnRender,
}: Props) => {
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

  const switchOverlay = () => {
    if (routeChecker.isMeasuresAndResultsPage(route)) {
      return (
        <EntityDetailsOverlayQualityMeasures
          closeEntityDetailsOverlay={closeEntityDetailsOverlay}
          report={report}
          route={route}
          selectedEntity={selectedEntity}
          submitting={submitting}
        />
      );
    }

    if (reportType === ReportType.MLR) {
      return (
        <EntityDetailsOverlayReporting
          closeEntityDetailsOverlay={closeEntityDetailsOverlay}
          disabled={disabled}
          entities={entities}
          entityType={entityType}
          form={form}
          onSubmit={onSubmit}
          selectedEntity={selectedEntity}
          submitting={submitting}
          validateOnRender={validateOnRender}
        />
      );
    }

    return <></>;
  };

  return (
    <Box>
      <BackButton
        onClick={closeEntityDetailsOverlay}
        text={backButtonText(reportType)}
      />
      {switchOverlay()}
    </Box>
  );
};

interface Props {
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
