import { useContext, useState } from "react";
// components
import { Box, Button, Heading, useDisclosure } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  AddEditReportModal,
  ReportContext,
  ReportPageFooter,
  ReportPageIntro,
} from "components";
// forms

// types
import {
  AnyObject,
  EntityShape,
  ModalOverlayReportPageShape,
  ReportShape,
  ReportStatus,
} from "types";
// utils
import { convertDateUtcToEt, filterFormData, useUser } from "utils";
// verbiage
import accordionVerbiage from "../../verbiage/pages/mlr/mlr-accordions";

export const ModalOverlayReportPage = ({ route }: Props) => {
  const { entityType, verbiage, modalForm } = route;
  const { full_name, state, userIsStateUser, userIsStateRep } =
    useUser().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );

  const { report, updateReport } = useContext(ReportContext);
  const reportFieldDataEntities = report?.fieldData[entityType] || [];

  const dashTitle = `${verbiage.dashboardTitle}${
    verbiage.countEntitiesInTitle ? ` ${reportFieldDataEntities.length}` : ""
  }`;

  const onSubmit = async (enteredData: AnyObject) => {
    if (userIsStateUser || userIsStateRep) {
      setSubmitting(true);
      const reportKeys = {
        reportType: report?.reportType,
        state: state,
        id: report?.id,
      };
      const currentEntities = reportFieldDataEntities;
      const selectedEntityIndex = report?.fieldData[entityType].findIndex(
        (entity: EntityShape) => entity.id === selectedEntity?.id
      );
      const filteredFormData = filterFormData(enteredData, modalForm.fields);
      const newEntity = {
        ...selectedEntity,
        ...filteredFormData,
      };
      let newEntities = currentEntities;
      newEntities[selectedEntityIndex] = newEntity;
      const dataToWrite = {
        metadata: {
          status: ReportStatus.IN_PROGRESS,
          lastAlteredBy: full_name,
        },
        fieldData: {
          [entityType]: newEntities,
        },
      };
      await updateReport(reportKeys, dataToWrite);
      setSubmitting(false);
    }
    closeAddEditEntityModal();
  };

  // add/edit entity modal disclosure and methods
  const {
    isOpen: addEditEntityModalIsOpen,
    onOpen: addEditEntityModalOnOpenHandler,
    onClose: addEditEntityModalOnCloseHandler,
  } = useDisclosure();

  const openAddEditEntityModal = (entity?: EntityShape) => {
    if (entity) setSelectedEntity(entity);
    addEditEntityModalOnOpenHandler();
  };

  const closeAddEditEntityModal = () => {
    setSelectedEntity(undefined);
    addEditEntityModalOnCloseHandler();
  };

  return (
    <Box data-testid="modal-overlay-report-page">
      {verbiage.intro && (
        <ReportPageIntro
          text={verbiage.intro}
          accordion={accordionVerbiage.formIntro}
        />
      )}
      <Box sx={sx.dashboardBox}>
        <Heading as="h3" sx={sx.dashboardTitle}>
          {dashTitle}
        </Heading>
        {reportFieldDataEntities.length === 0 && (
          <Box>{verbiage.emptyDashboardText}</Box>
        )}
        <Button
          sx={sx.addEntityButton}
          onClick={() => openAddEditEntityModal()}
        >
          {verbiage.addEntityButtonText}
        </Button>
      </Box>
      <ReportPageFooter />
      {report && (
        <AddEditEntityModal
          entityType={entityType}
          selectedEntity={selectedEntity}
          verbiage={verbiage}
          form={modalForm}
          modalDisclosure={{
            isOpen: addEditEntityModalIsOpen,
            onClose: closeAddEditEntityModal,
          }}
        />
      )}
    </Box>
  );
};

interface Props {
  route: ModalOverlayReportPageShape;
}

const sx = {
  dashboardBox: { textAlign: "center" },
  dashboardTitle: {
    marginBottom: "1.25rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
    textAlign: "left",
  },

  addEntityButton: {
    marginTop: "1.5rem",
    marginBottom: "2rem",
  },
  bottomAddEntityButton: {
    marginTop: "2rem",
    marginBottom: "0",
  },
};
