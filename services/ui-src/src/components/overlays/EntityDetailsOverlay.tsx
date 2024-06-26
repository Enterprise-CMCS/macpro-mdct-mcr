import React, { MouseEventHandler, useContext, useEffect } from "react";
// components
import { Box, Button, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import { Form, ReportPageIntro } from "components";
// types
import { EntityShape, EntityType, FormJson } from "types";
// utils

// assets
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";
// verbiage
import accordionVerbiage from "../../verbiage/pages/accordion";
import overlayVerbiage from "../../verbiage/pages/overlays";
import { EntityContext } from "components/reports/EntityProvider";

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
  const { setEntities, setSelectedEntity, setEntityType } =
    useContext(EntityContext);

  useEffect(() => {
    setSelectedEntity(selectedEntity);
    setEntityType(entityType);
    setEntities(entities);
    return () => {
      setEntities([]);
      setSelectedEntity(undefined);
    };
  }, [entityType, selectedEntity]);

  setEntering(false);

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
      <Button
        sx={sx.backButton}
        variant="none"
        onClick={closeEntityDetailsOverlay as MouseEventHandler}
        aria-label="Return to MLR reporting"
      >
        <Image src={arrowLeftBlue} alt="Arrow left" sx={sx.backIcon} />
        Return to MLR Reporting
      </Button>
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
      <Box sx={sx.footerBox}>
        <Flex sx={sx.buttonFlex}>
          {disabled ? (
            <Button
              variant="outline"
              onClick={closeEntityDetailsOverlay as MouseEventHandler}
            >
              Return
            </Button>
          ) : (
            <Button type="submit" form={form.id} sx={sx.saveButton}>
              {submitting ? <Spinner size="md" /> : "Save & return"}
            </Button>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

interface Props {
  closeEntityDetailsOverlay: Function;
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
  backButton: {
    padding: 0,
    fontWeight: "normal",
    color: "palette.primary",
    display: "flex",
    position: "relative",
    right: "3rem",
    marginBottom: "2rem",
    marginTop: "-2rem",
  },
  backIcon: {
    color: "palette.primary",
    height: "1rem",
    marginRight: "0.5rem",
  },
  footerBox: {
    marginTop: "2rem",
    borderTop: "1.5px solid var(--chakra-colors-palette-gray_light)",
  },
  buttonFlex: {
    justifyContent: "end",
    marginY: "1.5rem",
  },
  saveButton: {
    width: "8.25rem",
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
        "&:first-child": {
          fontWeight: "bold",
        },
      },
    },
  },
};
