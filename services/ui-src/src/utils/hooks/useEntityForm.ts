import { useDisclosure } from "@chakra-ui/react";
import { useStore } from "utils";
import { EntityShape } from "types";

export const useEntityForm = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { setSelectedEntity } = useStore();

  const openForm = (entity?: EntityShape) => {
    setSelectedEntity(entity);
    onOpen();
  };

  const closeForm = () => {
    setSelectedEntity(undefined);
    onClose();
  };

  return {
    isOpen,
    onClose: closeForm,
    onOpen: openForm,
  };
};
