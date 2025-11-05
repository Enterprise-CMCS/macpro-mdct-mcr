import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { EntityForm } from "components/reports/EntityForm";
import { ReportPageFooter } from "components/reports/ReportPageFooter";
import { EntityShape } from "types";
import { ReportPageShapeBase } from "types/reports";
import { useStore } from "utils";

export const ReportPage = ({ route, validateOnRender }: Props) => {
  const { report, selectedEntity, setSelectedEntity } = useStore();
  const formDisclosure = useDisclosure();
  const openEntityForm = (entity?: EntityShape) => {
    setSelectedEntity(entity);
    formDisclosure.onOpen();
  };

  const { verbiage, pageConfig } = route;

  return (
    <Box>
      <p>New section!!!!</p>
      <Button onClick={() => openEntityForm()}>Open Entity Form</Button>

      {pageConfig.entityForm && (
        <EntityForm
          variant={pageConfig.entityForm.variant}
          isOpen={formDisclosure.isOpen}
          onClose={formDisclosure.onClose}
          entity={selectedEntity}
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
  route: ReportPageShapeBase;
  validateOnRender?: boolean;
}
