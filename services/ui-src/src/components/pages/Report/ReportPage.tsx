import { useState } from "react";
import { Box, Button, useDisclosure } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  DeleteEntityModal,
  ReportPageFooter,
} from "components";
import { EntityShape, EntityType, ReportPageShapeBase } from "types";
import { resetClearProp, useStore } from "utils";

export const ReportPage = ({ route }: Props) => {
  const { report } = useStore();

  const { verbiage, pageConfig } = route;
  // const { hideSidebar, hasModal, hasDrawer, hasOverlay } = pageConfig;

  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );

  // add/edit entity modal disclosure and methods
  const {
    isOpen: addEditEntityModalIsOpen,
    onOpen: addEditEntityModalOnOpenHandler,
    onClose: addEditEntityModalOnCloseHandler,
  } = useDisclosure();

  const closeAddEditEntityModal = () => {
    setSelectedEntity(undefined);
    resetClearProp(route.forms?.[1].modalForm?.fields);
    addEditEntityModalOnCloseHandler();
  };

  // delete modal disclosure and methods
  const {
    isOpen: deleteEntityModalIsOpen,
    // onOpen: deleteEntityModalOnOpenHandler,
    onClose: deleteEntityModalOnCloseHandler,
  } = useDisclosure();

  const closeDeleteEntityModal = () => {
    setSelectedEntity(undefined);
    deleteEntityModalOnCloseHandler();
  };
  return (
    <Box>
      <p>{route.path}</p>
      <p>{report?.reportType}</p>
      {pageConfig!.features?.hasModal && (
        <Box>
          <Button
            sx={sx.topAddEntityButton}
            onClick={addEditEntityModalOnOpenHandler}
          >
            Add entity
          </Button>
        </Box>
      )}
      <AddEditEntityModal
        entityType={EntityType.PLANS}
        selectedEntity={selectedEntity}
        verbiage={verbiage}
        form={route.forms?.[1].modalForm}
        modalDisclosure={{
          isOpen: addEditEntityModalIsOpen,
          onClose: closeAddEditEntityModal,
        }}
      />
      <DeleteEntityModal
        entityType={EntityType.PLANS}
        selectedEntity={selectedEntity}
        verbiage={verbiage}
        modalDisclosure={{
          isOpen: deleteEntityModalIsOpen,
          onClose: closeDeleteEntityModal,
        }}
      />
      <ReportPageFooter />
    </Box>
  );
};

const sx = {
  topAddEntityButton: {
    marginTop: "spacer3",
    marginBottom: "spacer4",
  },
};

interface Props {
  route: ReportPageShapeBase;
  validateOnRender?: boolean;
}
