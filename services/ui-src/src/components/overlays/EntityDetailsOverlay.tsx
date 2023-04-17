import { useContext, useEffect, useState } from "react";
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";
// components
import { Form, ReportContext, ReportPageIntro } from "components";
import { Box, Button, Flex, Image } from "@chakra-ui/react";
// utils
import {
  AnyObject,
  EntityShape,
  EntityType,
  FormJson,
  ReportStatus,
} from "types";
import { useUser } from "utils";
import accordionVerbiage from "../../verbiage/pages/accordion";
import overlayVerbiage from "../../verbiage/pages/overlays";
import { EntityContext } from "components/reports/EntityProvider";
import { Spinner } from "@cmsgov/design-system";
export const EntityDetailsOverlay = ({
  entityType,
  form,
  verbiage,
  selectedEntity,
  closeEntityDetailsOverlay,
  setSidebarHidden,
}: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { report, updateReport } = useContext(ReportContext);
  const { userIsAdmin, userIsApprover, userIsHelpDeskUser, full_name, state } =
    useUser().user ?? {};
  const isAdminTypeUser = userIsAdmin || userIsApprover || userIsHelpDeskUser;
  const onError = () => {};
  const {
    entities,
    updateEntities,
    setEntities,
    setSelectedEntity,
    setEntityType,
  } = useContext(EntityContext);

  useEffect(() => {
    setSelectedEntity(selectedEntity);
    setSidebarHidden(true);
    setEntityType(entityType);
    setEntities(report?.fieldData[entityType]);
    return () => {
      setEntities([]);
      setSelectedEntity(undefined);
      setSidebarHidden(false);
    };
  }, [entityType, selectedEntity]);

  const onSubmit = async (enteredData: AnyObject) => {
    setSubmitting(true);
    updateEntities(enteredData);
    const reportKeys = {
      reportType: report?.reportType,
      state: state,
      id: report?.id,
    };
    const dataToWrite = {
      metadata: {
        status: ReportStatus.IN_PROGRESS,
        lastAlteredBy: full_name,
      },
      fieldData: {
        program: entities,
      },
    };
    await updateReport(reportKeys, dataToWrite);
    setSubmitting(false);
    closeEntityDetailsOverlay();
    setSidebarHidden(false);
  };

  const closeOverlay = () => {
    setSidebarHidden(true);
    closeEntityDetailsOverlay();
  };

  const { report_programName, report_planName } = selectedEntity;

  const reportingPeriod = `${selectedEntity.report_reportingPeriodStartDate} to ${selectedEntity.report_reportingPeriodEndDate}`;
  const eligibilityGroup = () => {
    if (selectedEntity && selectedEntity["report_eligibilityGroup-otherText"]) {
      return selectedEntity["report_eligibilityGroup-otherText"];
    }
    return selectedEntity.report_eligibilityGroup[0].value;
  };

  const programInfo = [
    report_programName,
    eligibilityGroup(),
    reportingPeriod,
    report_planName,
  ];

  return (
    <Box sx={sx}>
      <Box data-testid="entity-details-overlay">
        <Box
          as="button"
          sx={sx.backButton}
          onClick={closeOverlay}
          aria-label="Return to MLR reporting"
        >
          <Image src={arrowLeftBlue} alt="Arrow left" sx={sx.backIcon} />
          Return to MLR Reporting
        </Box>
        {verbiage.intro && (
          <ReportPageIntro
            text={overlayVerbiage.MLR.intro}
            accordion={accordionVerbiage.MLR.detailIntro}
          />
        )}
        <Box sx={sx.programInfo}>
          <ul>
            {programInfo.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </Box>
        <Form
          id={selectedEntity.id}
          formJson={form}
          onSubmit={onSubmit}
          onError={onError}
          formData={selectedEntity}
          autosave={true}
        />
        <Box sx={sx.footerBox}>
          <Flex sx={sx.buttonFlex}>
            {!isAdminTypeUser && (
              <Button variant="outline" onClick={() => closeOverlay()}>
                Cancel
              </Button>
            )}
            <Button
              onClick={() => onSubmit(selectedEntity)}
              type="submit"
              sx={sx.saveButton}
            >
              {submitting ? <Spinner size="small" /> : "Submit"}
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

interface Props {
  entityType: EntityType;
  form: FormJson;
  verbiage: AnyObject;
  selectedEntity: EntityShape;
  closeEntityDetailsOverlay: Function;
  setSidebarHidden: Function;
}

const sx = {
  overlayContainer: {
    backgroundColor: "palette.white",
    width: "100%",
  },
  backButton: {
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
    position: "relative",
    top: "0.25rem",
  },
  footerBox: {
    marginTop: "2rem",
    borderTop: "1.5px solid var(--chakra-colors-palette-gray_light)",
  },
  buttonFlex: {
    justifyContent: "space-between",
    marginY: "1.5rem",
  },
  saveButton: {
    width: "8.25rem",
  },
  programInfo: {
    maxWidth: "18.75rem",
    ul: {
      margin: "0.5rem auto",
      listStyleType: "none",
      li: {
        wordWrap: "break-word",
        paddingTop: "0.125rem",
        paddingBottom: "0.125rem",
        whiteSpace: "break-spaces",
        "&:last-of-type": {
          fontWeight: "bold",
          fontSize: "md",
        },
      },
    },
  },
};
