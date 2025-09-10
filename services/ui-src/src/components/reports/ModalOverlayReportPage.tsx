import { useContext, useState } from "react";
// components
import { Box, Button, Heading, useDisclosure } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  DeleteEntityModal,
  EntityDetailsOverlay,
  EntityProvider,
  EntityRow,
  ReportContext,
  ReportPageFooter,
  ReportPageIntro,
  Table,
} from "components";
// types
import {
  AnyObject,
  EntityShape,
  isFieldElement,
  ModalOverlayReportPageShape,
  ReportStatus,
} from "types";
// utils
import {
  entityWasUpdated,
  filterFormData,
  getEntriesToClear,
  setClearedEntriesToDefaultValue,
  useBreakpoint,
  useStore,
  resetClearProp,
} from "utils";
// verbiage
import accordionVerbiage from "verbiage/pages/accordion";
import { SaveAndCreateNextEntityModal } from "components/modals/SaveAndCreateNextEntityModal";

export const ModalOverlayReportPage = ({
  route,
  setSidebarHidden,
  validateOnRender,
}: Props) => {
  // Route Information
  const { entityType, verbiage, modalForm, overlayForm } = route;

  // Context Information
  const { isMobile } = useBreakpoint();
  const { updateReport } = useContext(ReportContext);
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] = useState<boolean>();
  const [currentEntity, setCurrentEntity] = useState<EntityShape | undefined>(
    undefined
  );
  const [entering, setEntering] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // state management
  const { userIsAdmin, userIsReadOnly, userIsEndUser, full_name, state } =
    useStore().user ?? {};
  const { report } = useStore();

  // Determine whether form is locked or unlocked based on user and route
  const isAdminUserType = userIsAdmin || userIsReadOnly;
  const isLocked = report?.locked || isAdminUserType;

  // Display Variables
  const reportFieldDataEntities = report?.fieldData[entityType] || [];
  const dashTitle = `${verbiage.dashboardTitle} ${reportFieldDataEntities.length}`;
  const tableHeaders = () => {
    if (isMobile)
      return {
        caption: verbiage.tableHeader,
        headRow: [{ hiddenName: "Status" }, { hiddenName: "Content" }],
      };
    return {
      caption: verbiage.tableHeader,
      headRow: [
        { hiddenName: "Status" },
        verbiage.tableHeader,
        { hiddenName: "Action" },
      ],
    };
  };

  // Add/edit entity modal disclosure and methods
  const {
    isOpen: addEditEntityModalIsOpen,
    onOpen: addEditEntityModalOnOpenHandler,
    onClose: addEditEntityModalOnCloseHandler,
  } = useDisclosure();

  const openAddEditEntityModal = (entity?: EntityShape) => {
    if (entity) setCurrentEntity(entity);
    addEditEntityModalOnOpenHandler();
  };

  const closeAddEditEntityModal = () => {
    setCurrentEntity(undefined);
    resetClearProp(modalForm.fields);
    addEditEntityModalOnCloseHandler();
  };

  // Delete entity modal disclosure and methods
  const {
    isOpen: deleteEntityModalIsOpen,
    onOpen: deleteEntityModalOnOpenHandler,
    onClose: deleteEntityModalOnCloseHandler,
  } = useDisclosure();

  const openDeleteEntityModal = (entity: EntityShape) => {
    setCurrentEntity(entity);
    deleteEntityModalOnOpenHandler();
  };

  const closeDeleteEntityModal = () => {
    setCurrentEntity(undefined);
    deleteEntityModalOnCloseHandler();
  };

  // Add/edit "Save and create another" entity modal disclosure and methods
  const {
    isOpen: addEditAnotherEntityModalIsOpen,
    onOpen: addEditAnotherEntityModalOnOpenHandler,
    onClose: addEditAnotherEntityModalOnCloseHandler,
  } = useDisclosure();

  const openAddEditAnotherEntityModal = (entity?: EntityShape) => {
    if (entity) setCurrentEntity(entity);
    addEditAnotherEntityModalOnOpenHandler();
  };

  const closeAddEditAnotherEntityModal = () => {
    setCurrentEntity(undefined);
    resetClearProp(modalForm.fields);
    addEditAnotherEntityModalOnCloseHandler();
  };

  // Open/Close overlay action methods
  const openEntityDetailsOverlay = (entity: EntityShape) => {
    setEntering(true);
    setCurrentEntity(entity);
    setIsEntityDetailsOpen(true);
    setSidebarHidden(true);
  };

  const closeEntityDetailsOverlay = () => {
    setCurrentEntity(undefined);
    setIsEntityDetailsOpen(false);
    setSidebarHidden(false);
  };

  // Form submit methods
  const onSubmit = async (enteredData: AnyObject) => {
    if (userIsEndUser) {
      setSubmitting(true);
      const reportKeys = {
        reportType: report?.reportType,
        state: state,
        id: report?.id,
      };
      const currentEntities = [...(report?.fieldData[entityType] || [])];
      const selectedEntityIndex = report?.fieldData[entityType].findIndex(
        (entity: EntityShape) => entity.id === currentEntity?.id
      );
      const filteredFormData = filterFormData(
        enteredData,
        overlayForm!.fields.filter(isFieldElement)
      );
      const entriesToClear = getEntriesToClear(
        enteredData,
        overlayForm!.fields.filter(isFieldElement)
      );
      const newEntity = {
        ...currentEntity,
        ...filteredFormData,
      };
      let newEntities = currentEntities;
      newEntities[selectedEntityIndex] = newEntity;
      newEntities[selectedEntityIndex] = setClearedEntriesToDefaultValue(
        newEntities[selectedEntityIndex],
        entriesToClear
      );
      const shouldSave = entityWasUpdated(
        reportFieldDataEntities[selectedEntityIndex],
        newEntity
      );
      if (shouldSave) {
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
      }
      setSubmitting(false);
    }
    closeEntityDetailsOverlay();
    setSidebarHidden(false);
  };

  return (
    <Box>
      {overlayForm && isEntityDetailsOpen && currentEntity ? (
        <EntityProvider>
          <EntityDetailsOverlay
            closeEntityDetailsOverlay={closeEntityDetailsOverlay}
            entityType={entityType}
            entities={report?.fieldData[entityType]}
            form={overlayForm}
            onSubmit={onSubmit}
            selectedEntity={currentEntity}
            disabled={!userIsEndUser}
            setEntering={setEntering}
            submitting={submitting}
            validateOnRender={validateOnRender}
          />
        </EntityProvider>
      ) : (
        <Box sx={sx.content}>
          <ReportPageIntro
            text={verbiage.intro}
            accordion={
              accordionVerbiage[
                report?.reportType as keyof typeof accordionVerbiage
              ].formIntro
            }
            reportType={report?.reportType}
          />

          <Box sx={sx.dashboardBox}>
            <Heading as="h3" sx={sx.dashboardTitle}>
              {dashTitle}
            </Heading>
            {reportFieldDataEntities.length === 0 ? (
              <>
                <Box sx={sx.tableSeparator} />
                <Box sx={sx.emptyDashboard}>{verbiage.emptyDashboardText}</Box>
              </>
            ) : (
              <Table sx={sx.table} content={tableHeaders()}>
                {reportFieldDataEntities.map((entity: EntityShape) => (
                  <EntityRow
                    key={entity.id}
                    entity={entity}
                    verbiage={verbiage}
                    locked={isLocked}
                    entering={entering}
                    openAddEditEntityModal={openAddEditEntityModal}
                    openDeleteEntityModal={openDeleteEntityModal}
                    openOverlayOrDrawer={openEntityDetailsOverlay}
                  />
                ))}
              </Table>
            )}
            <Button
              sx={sx.addEntityButton}
              disabled={isLocked}
              // open "Save and create another" modal
              onClick={
                modalForm.id === "am-modal"
                  ? () => openAddEditAnotherEntityModal()
                  : () => openAddEditEntityModal()
              }
            >
              {verbiage.addEntityButtonText}
            </Button>
          </Box>

          <AddEditEntityModal
            entityType={entityType}
            selectedEntity={currentEntity}
            verbiage={verbiage}
            form={modalForm}
            modalDisclosure={{
              isOpen: addEditEntityModalIsOpen,
              onClose: closeAddEditEntityModal,
            }}
          />

          {/* "Save and create another modal" */}
          <SaveAndCreateNextEntityModal
            entityType={entityType}
            selectedEntity={currentEntity}
            verbiage={verbiage}
            form={modalForm}
            modalDisclosure={{
              isOpen: addEditAnotherEntityModalIsOpen,
              onOpen: openAddEditAnotherEntityModal,
              onClose: closeAddEditAnotherEntityModal,
            }}
          />

          <DeleteEntityModal
            entityType={entityType}
            selectedEntity={currentEntity}
            verbiage={verbiage}
            modalDisclosure={{
              isOpen: deleteEntityModalIsOpen,
              onClose: closeDeleteEntityModal,
            }}
          />

          <ReportPageFooter />
        </Box>
      )}
    </Box>
  );
};

interface Props {
  route: ModalOverlayReportPageShape;
  setSidebarHidden: Function;
  validateOnRender?: boolean;
}

const sx = {
  content: {
    ".tablet &, .mobile &": {
      width: "100%",
    },
  },
  dashboardBox: {
    textAlign: "center",
  },
  dashboardTitle: {
    fontSize: "md",
    fontWeight: "bold",
    color: "gray_medium",
    textAlign: "left",
    ".tablet &, .mobile &": {
      paddingBottom: "0",
    },
  },
  emptyDashboard: {
    paddingTop: "1rem",
  },
  tableSeparator: {
    borderTop: "1px solid",
    borderColor: "gray_light",
    paddingBottom: "1rem",
    marginTop: "1.25rem",
  },
  table: {
    tableLayout: "fixed",
    br: {
      marginBottom: "0.25rem",
    },
    th: {
      paddingLeft: "1rem",
      paddingRight: "0",
      borderBottom: "1px solid",
      borderColor: "gray_light",
      ".mobile &": {
        border: "none",
      },
      "&:nth-of-type(1)": {
        width: "2.5rem",
      },
      "&:nth-of-type(3)": {
        width: "260px",
      },
    },
  },
  addEntityButton: {
    marginTop: "2rem",
    marginBottom: "2rem",
    ".tablet &, .mobile &": {
      wordBreak: "break-word",
      whiteSpace: "break-spaces",
    },
  },
};
