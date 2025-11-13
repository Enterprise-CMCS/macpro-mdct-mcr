import React, { MouseEventHandler, useEffect } from "react";
// components
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import {
  BackButton,
  DrawerReportPageEntityRows,
  Form,
  ReportPageIntro,
  SaveReturnButton,
} from "components";
// types
import {
  EntityShape,
  FormJson,
  EntityType,
  ReportType,
  ModalOverlayReportPageShape,
} from "types";
// utils
import { getReportVerbiage, useStore } from "utils";
// verbiage
import accordionVerbiage from "verbiage/pages/accordion";
import overlayVerbiage from "verbiage/pages/overlays";

export const EntityDetailsOverlay = ({
  closeEntityDetailsOverlay,
  entityType,
  entities,
  form,
  onSubmit,
  selectedEntity,
  disabled,
  setEntering,
  route,
  submitting,
  validateOnRender,
}: Props) => {
  const { report } = useStore();
  const reportType = report?.reportType;
  const isQualityMeasures =
    route?.path ===
    "/mcpar/plan-level-indicators/quality-measures/measures-and-results";

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

  const mlrReportingOverlay = () => {
    // Display Variables
    const {
      report_programName: reportProgramName,
      report_planName: reportPlanName,
    } = selectedEntity;
    const eligibilityGroup = `${
      selectedEntity["report_eligibilityGroup-otherText"] ||
      selectedEntity.report_eligibilityGroup[0].value
    }`;
    const reportingPeriod = `${selectedEntity.report_reportingPeriodStartDate} to ${selectedEntity.report_reportingPeriodEndDate}`;

    const programInfo = [
      reportPlanName,
      reportProgramName,
      eligibilityGroup,
      reportingPeriod,
    ];

    return (
      <Box>
        <BackButton
          onClick={closeEntityDetailsOverlay}
          text={overlayVerbiage.MLR.backButton}
        />
        <ReportPageIntro
          text={overlayVerbiage.MLR.intro}
          accordion={accordionVerbiage.MLR.detailIntro}
        />
        <Box sx={sx.programInfo}>
          <Text sx={sx.textHeading}>MLR report for:</Text>
          <ul>
            {programInfo.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </Box>
        <Form
          id={form.id}
          formJson={form}
          onSubmit={onSubmit}
          formData={selectedEntity}
          autosave={true}
          disabled={disabled}
          validateOnRender={validateOnRender || false}
          dontReset={true}
        />
        <SaveReturnButton
          disabled={disabled}
          disabledOnClick={closeEntityDetailsOverlay}
          formId={form.id}
          submitting={submitting}
        />
      </Box>
    );
  };

  const qualityMeasuresOverlay = () => {
    const { qualityMeasuresVerbiage } = getReportVerbiage(reportType);
    const { tableHeaders } = qualityMeasuresVerbiage;
    return (
      <Box>
        <BackButton
          onClick={closeEntityDetailsOverlay}
          text={overlayVerbiage.MCPAR.backButton}
        />
        <Heading>{selectedEntity.measure_name}</Heading>
        <Flex>
          <Box>
            <Text>{tableHeaders.measureId}</Text>
            <Text>{tableHeaders.dataVersion}</Text>
            <Text>{tableHeaders.activities}</Text>
          </Box>
          <Box>
            <Text>{selectedEntity.measure_identifierCmit}</Text>
            <Text>{selectedEntity.measure_dataVersion[0].value}</Text>
            <Text>{selectedEntity.measure_activities[0].value}</Text>
          </Box>
        </Flex>
        <Box>
          <Heading as="h2">Report results by plan</Heading>
          <Heading as="h3">
            For each plan listed, enter and respond to the indicators within.
          </Heading>
        </Box>
        <DrawerReportPageEntityRows
          route={route!}
          entities={entities}
          openRowDrawer={() => {}}
          openDeleteEntityModal={() => {}}
          drawerForm={route?.drawerForm}
          plans={report?.fieldData["plans"]}
        />
      </Box>
    );
  };

  return reportType === ReportType.MLR ? (
    mlrReportingOverlay()
  ) : reportType === ReportType.MCPAR && isQualityMeasures ? (
    qualityMeasuresOverlay()
  ) : (
    <></>
  );
};

interface Props {
  closeEntityDetailsOverlay: MouseEventHandler;
  entityType: EntityType;
  entities: any;
  form: FormJson;
  onSubmit: Function;
  selectedEntity: EntityShape;
  disabled: boolean;
  setEntering: Function;
  route?: ModalOverlayReportPageShape;
  submitting?: boolean;
  validateOnRender?: boolean;
}

const sx = {
  textHeading: {
    fontWeight: "bold",
    lineHeight: "1.25rem",
  },
  programInfo: {
    ul: {
      margin: "0.5rem auto 0 auto",
      listStyleType: "none",
      li: {
        wordWrap: "break-word",
        whiteSpace: "break-spaces",
        fontSize: "xl",
        lineHeight: "1.75rem",
        "&:first-of-type": {
          fontWeight: "bold",
        },
      },
    },
  },
};
