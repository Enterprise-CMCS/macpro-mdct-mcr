import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { add } from "date-fns";
// components
import {
  Button,
  Modal,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  ModalContent,
  Text,
} from "@chakra-ui/react";
// constants
import { PROMPT_AT, IDLE_WINDOW } from "../../constants";
// utils
import {
  calculateRemainingSeconds,
  refreshCredentials,
  updateTimeout,
  UserContext,
} from "utils";

export const Timeout = () => {
  const context = useContext(UserContext);
  const { logout } = context;
  const [timeLeft, setTimeLeft] = useState((IDLE_WINDOW - PROMPT_AT) / 1000);
  const [showTimeout, setShowTimeout] = useState(false);
  const [timeoutPromptId, setTimeoutPromptId] = useState<number>();
  const [timeoutForceId, setTimeoutForceId] = useState<number>();
  const [updateTextIntervalId, setUpdateTextIntervalId] = useState<number>();
  const location = useLocation();

  /*
   * TODO: When autosave is implemented, set up a callback function to listen to calls to update in authLifecycle
   * subscribeToUpdateTimeout(() => {
   *   setTimer();
   * });
   */
  useEffect(() => {
    setTimer();
    return () => {
      clearTimers();
    };
  }, [location]);

  const setTimer = () => {
    const expiration = add(Date.now(), { seconds: IDLE_WINDOW / 1000 });
    if (timeoutPromptId) {
      clearTimers();
    }
    updateTimeout();
    setShowTimeout(false);

    // Set the initial timer for when a prompt appears
    const promptTimer = window.setTimeout(() => {
      // Once the prompt appears, set timers for logging out, and for updating text on screen
      setTimeLeft(calculateRemainingSeconds(expiration));
      setShowTimeout(true);
      const forceLogoutTimer = window.setTimeout(() => {
        clearTimers();
        logout();
      }, IDLE_WINDOW - PROMPT_AT);
      const updateTextTimer = window.setInterval(() => {
        setTimeLeft(calculateRemainingSeconds(expiration));
      }, 500);
      setTimeoutForceId(forceLogoutTimer);
      setUpdateTextIntervalId(updateTextTimer);
    }, PROMPT_AT);
    setTimeoutPromptId(promptTimer);
  };

  const clearTimers = () => {
    clearTimeout(timeoutPromptId);
    clearTimeout(timeoutForceId);
    clearTimeout(updateTextIntervalId);

    //clear interval function call
    setUpdateTextIntervalId(undefined);
  };

  const refreshAuth = async () => {
    await refreshCredentials();
    setShowTimeout(false);
    setTimer();
  };

  const formatTime = (time: number) => {
    return `${Math.floor(time)} seconds`;
  };

  return (
    <Modal isOpen={showTimeout} onClose={refreshAuth}>
      <ModalOverlay />
      <ModalContent sx={sx.modalContent}>
        <ModalHeader sx={sx.modalHeader}>Session timeout</ModalHeader>
        <ModalBody sx={sx.modalBody}>
          <Text>
            Due to inactivity, you will be logged out in {formatTime(timeLeft)}.
            Choose to stay logged in or log out. Otherwise, you will be logged
            out automatically.
          </Text>
        </ModalBody>
        <ModalFooter sx={sx.modalFooter}>
          <Button sx={sx.stayActive} onClick={refreshAuth} type="submit">
            Stay logged in
          </Button>
          <Button
            sx={sx.close}
            onClick={logout}
            type="submit"
            variant="outline"
            data-testid="modal-logout-button"
          >
            Log out
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const sx = {
  modalContent: {
    boxShadow: ".125rem .125rem .25rem",
    borderRadius: "0",
    maxWidth: "30rem",
    marginX: "4rem",
    padding: "0",
  },
  modalHeader: {
    padding: "2rem 2rem 0 2rem",
  },
  modalBody: {
    padding: "1rem 2rem 0 2rem",
  },
  modalFooter: {
    justifyContent: "flex-start",
    padding: "0 2rem 2rem 2rem",
  },
  stayActive: {
    justifyContent: "center",
    marginTop: "spacer2",
    marginRight: "spacer2",
    minWidth: "7.5rem",
    span: {
      marginLeft: "spacer2",
      marginRight: "-0.25rem",
      "&.ds-c-spinner": {
        marginLeft: 0,
      },
    },
    ".mobile &": {
      fontSize: "sm",
    },
  },
  close: {
    justifyContent: "start",
    padding: "0.5rem 1rem",
    marginTop: "spacer2",
    span: {
      marginLeft: "0rem",
      marginRight: "spacer1",
    },
    ".mobile &": {
      fontSize: "sm",
      marginRight: "0",
    },
  },
};
