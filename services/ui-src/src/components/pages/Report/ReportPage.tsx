import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { EntityDisplay } from "components/reports/EntityDisplay";
import { EntityForm } from "components/reports/EntityForm";
import { ReportPageFooter } from "components/reports/ReportPageFooter";
import { EntityShape } from "types";
import { StandardReportPageShape } from "types/reports";
import { useStore } from "utils";
import { useEntityManagement } from "utils/reports/useEntityManagement";

export const ReportPage = ({ route, validateOnRender }: Props) => {
  const { report, selectedEntity, setSelectedEntity } = useStore();
  const formDisclosure = useDisclosure();

  const { verbiage, pageConfig, entityType } = route;

  const openEntityForm = (entity?: EntityShape) => {
    setSelectedEntity(entity);
    formDisclosure.onOpen();
  };

  // Conditionally use hooks based on configuration
  const entityManagement = pageConfig.entityForm
    ? useEntityManagement({
        entityType: entityType!,
        report: report!,
        form: pageConfig.entityForm.editForm!,
        selectedEntity: undefined, // managed by editor hook
        onSuccess: () => formDisclosure.onClose(),
      })
    : null;

  return (
    <Box>
      <p>New section!!!!</p>

      {pageConfig.entityDisplay && (
        <>
          {pageConfig.features?.canAddEntities && (
            <Button onClick={() => openEntityForm()}>Add Entity</Button>
          )}

          <EntityDisplay
            variant={pageConfig.entityDisplay.variant}
            route={route}
            entities={entityManagement?.entities}
            entityType={entityType!}
            verbiage={verbiage}
            onEdit={openEntityForm}
            onDelete={() => console.log("delete entity")}
          />
        </>
      )}

      <Button onClick={() => openEntityForm()}>Open Entity Form</Button>

      {pageConfig.entityForm && (
        <EntityForm
          variant={pageConfig.entityForm.variant}
          isOpen={formDisclosure.isOpen}
          onClose={formDisclosure.onClose}
          entity={selectedEntity}
          entityType={route.entityType}
          form={pageConfig.entityForm.form}
          onSubmit={() => console.log("submit")}
          submitting={false}
          verbiage={verbiage}
          validateOnRender={validateOnRender}
        />
      )}

      {/* 
Add Delete Modal if feature is enabled

  {pageConfig.features?.canDeleteEntities && (
    <DeleteEntityModal ...props  />
  )}
*/}

      <ReportPageFooter />
    </Box>
  );
};

interface Props {
  route: StandardReportPageShape;
  validateOnRender?: boolean;
}
