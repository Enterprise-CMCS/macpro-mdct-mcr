import React, { MouseEventHandler, useEffect } from "react";
// components
import { Box, Text } from "@chakra-ui/react";
import {
  BackButton,
  Form,
  ReportPageIntro,
  SaveReturnButton,
} from "components";
// types
import { EntityShape, FormJson, EntityType } from "types";
// utils
import { useStore } from "utils";
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
  submitting,
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
        text={"Return to MLR Reporting"}
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

interface Props {
  closeEntityDetailsOverlay: MouseEventHandler;
  entityType: EntityType;
  entities: any;
  form: FormJson;
  onSubmit: Function;
  selectedEntity: EntityShape;
  disabled: boolean;
  setEntering: Function;
  submitting?: boolean;
  validateOnRender?: boolean;
}

const sx = {
  overlayContainer: {
    backgroundColor: "palette.white",
    width: "100%",
  },
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
