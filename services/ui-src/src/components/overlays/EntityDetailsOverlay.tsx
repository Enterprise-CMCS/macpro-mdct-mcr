import { useContext, useEffect, useState } from "react";
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";
// components
import {
  Form,
  ReportContext,
  ReportPageFooter,
  ReportPageIntro,
} from "components";
import { Box, Heading, Image, Text } from "@chakra-ui/react";
// utils
import {
  AnyObject,
  EntityShape,
  EntityType,
  FormJson,
  isFieldElement,
  ReportStatus,
} from "types";
import { filterFormData, useUser } from "utils";
import accordionVerbiage from "../../verbiage/pages/accordion";
import overlayVerbiage from "../../verbiage/pages/overlays";
import { EntityContext } from "components/reports/EntityProvider";
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
  const { full_name, state } = useUser().user ?? {};
  const onError = () => {};
  const { setEntities, setSelectedEntity, setEntityType } =
    useContext(EntityContext);

  useEffect(() => {
    setSidebarHidden(true);
    setEntityType(entityType);
    setSelectedEntity(selectedEntity);
    setEntities(report?.fieldData[entityType]);
    return () => {
      setEntities([]);
      setSelectedEntity(undefined);
      setSidebarHidden(false);
    };
  }, [entityType, selectedEntity]);

  const onSubmit = async (enteredData: AnyObject) => {
    setSubmitting(true);
    const reportKeys = {
      reportType: report?.reportType,
      state: state,
      id: report?.id,
    };
    const filteredFormData = filterFormData(
      enteredData,
      form.fields.filter(isFieldElement)
    );
    const dataToWrite = {
      metadata: {
        status: ReportStatus.IN_PROGRESS,
        lastAlteredBy: full_name,
      },
      fieldData: filteredFormData,
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
        <Box>
          <Heading size="xs">{report?.reportType} Report for:</Heading>
          <Text>{report?.programName || report?.submissionName}</Text>
          {selectedEntity.eligibilityGroup && (
            <Text>
              {selectedEntity["eligibilityGroup-otherText"]
                ? selectedEntity["eligibilityGroup-otherText"]
                : selectedEntity.eligibilityGroup[0].value}
            </Text>
          )}
          <Text>
            {selectedEntity.reportingPeriodStartDate} to{" "}
            {selectedEntity.reportingPeriodEndDate}
          </Text>
          <Text fontSize="lg" as="b">
            {selectedEntity.planName}
          </Text>
        </Box>
        <Form
          id={selectedEntity.id}
          formJson={form}
          onSubmit={onSubmit}
          onError={onError}
          formData={selectedEntity}
          autosave={true}
        />
        <ReportPageFooter submitting={submitting} form={form} />
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
};
