import { useContext, useState } from "react";
// components
import { Box, Button, Heading, Text, useDisclosure } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  EntityDetailsOverlay,
  EntityProvider,
  EntityRow,
  ReportContext,
  ReportDrawer,
  ReportPageFooter,
  ReportPageIntro,
  Table,
} from "components";
// types
import {
  AnyObject,
  EntityShape,
  isFieldElement,
  ModalOverlayDrawerReportPageShape,
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
  getAddEditDrawerText,
  getFormattedEntityData,
} from "utils";

export const ModalOverlayDrawerReportPage = ({
  route,
  setSidebarHidden,
  validateOnRender,
}: Props) => {
  // Route Information
  const { entityType, verbiage, modalForm, overlayForm, drawerForm } = route;
  console.log("verbiage", verbiage);

  // Context Information
  const { isMobile } = useBreakpoint();
  const { updateReport } = useContext(ReportContext);
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] = useState<boolean>();
  const [currentEntity, setCurrentEntity] = useState<EntityShape | undefined>(
    undefined
  );
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );
  const [entering, setEntering] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // state management
  const { userIsAdmin, userIsReadOnly, userIsEndUser, full_name, state } =
    useStore().user ?? {};
  const { report } = useStore();

  const reportType = report?.reportType;
  const formattedEntityData = getFormattedEntityData(
    entityType,
    selectedEntity,
    report?.fieldData
  );

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

  // report drawer disclosure and methods
  const {
    isOpen: drawerIsOpen,
    onOpen: drawerOnOpenHandler,
    onClose: drawerOnCloseHandler,
  } = useDisclosure();

  const openOverlayOrDrawer = (entity: EntityShape) => {
    setSelectedEntity(entity);
    drawerOnOpenHandler();
  };

  const closeDrawer = () => {
    setSelectedEntity(undefined);
    resetClearProp(drawerForm.fields);
    drawerOnCloseHandler();
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

  const AddEntityButton = () => (
    <Button sx={sx.addEntityButton} onClick={() => openAddEditEntityModal()}>
      {verbiage.addEntityButtonText}
    </Button>
  );

  return (
    <Box>
      <Box sx={sx.content}>
        <ReportPageIntro
          text={verbiage.intro}
          reportType={report?.reportType}
        />
        <Box>
          <>
            <AddEntityButton />
            <Heading as="h3" sx={sx.dashboardTitle}>
              {dashTitle}
            </Heading>
            <Table sx={sx.table} content={tableHeaders()}>
              {reportFieldDataEntities.map((entity: EntityShape) => (
                <EntityRow
                  key={entity.id}
                  entity={entity}
                  verbiage={verbiage}
                  entering={entering}
                  openOverlayOrDrawer={openEntityDetailsOverlay}
                />
              ))}
            </Table>
          </>
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
        <ReportDrawer
          entityType={entityType}
          selectedEntity={selectedEntity!}
          verbiage={{
            ...verbiage,
            drawerTitle: getAddEditDrawerText(
              entityType,
              formattedEntityData,
              verbiage
            ),
            drawerDetails: getFormattedEntityData(
              entityType,
              selectedEntity,
              report?.fieldData
            ),
          }}
          form={drawerForm}
          onSubmit={onSubmit}
          submitting={submitting}
          drawerDisclosure={{
            isOpen: drawerIsOpen,
            onClose: closeDrawer,
          }}
          validateOnRender={validateOnRender}
          data-testid="report-drawer"
        />
        <ReportPageFooter />
      </Box>
      {/* )} */}
    </Box>
  );
};

interface Props {
  route: ModalOverlayDrawerReportPageShape;
  setSidebarHidden: Function;
  validateOnRender?: boolean;
}

const sx = {
  content: {
    ".tablet &, .mobile &": {
      width: "100%",
    },
  },
  dashboardTitle: {
    fontSize: "md",
    fontWeight: "bold",
    color: "gray",
    textAlign: "left",
    ".tablet &, .mobile &": {
      paddingBottom: "0",
    },
  },
  table: {
    tableLayout: "fixed",
    br: {
      marginBottom: "spacer_half",
    },
    th: {
      fontSize: "md",
      fontWeight: "bold",
      lineHeight: "130%",
      color: "gray",
      paddingLeft: "spacer2",
      paddingRight: "0",
      borderBottom: "1px solid",
      borderColor: "gray_lighter",
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
    marginTop: "spacer3",
    marginBottom: "spacer3",
    ".tablet &, .mobile &": {
      wordBreak: "break-word",
      whiteSpace: "break-spaces",
    },
  },
};
