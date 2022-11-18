import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  ModalContent,
  Text,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import {
  calculateRemainingSeconds,
  refreshCredentials,
  updateTimeout,
  useUser,
} from "utils";
import { PROMPT_AT } from "../../constants";
import moment from "moment";

export const Timeout = () => {
  const { logout, getExpiration } = useUser();
  const initialExpirationTime = getExpiration();
  const [expirationTime, setExpirationTime] = useState(initialExpirationTime);
  const [timeLeft, setTimeLeft] = useState(
    calculateRemainingSeconds(expirationTime)
  );
  const [showTimeout, setShowTimeout] = useState(false);
  const location = useLocation();

  useEffect(() => {
    updateTimeout();
    const newExpirationTime = getExpiration();
    setExpirationTime(newExpirationTime);
    setTimeLeft(calculateRemainingSeconds(newExpirationTime));
  }, [location]);

  useEffect(() => {
    if (timeLeft * 1000 < PROMPT_AT) {
      setShowTimeout(true);
    }

    if (timeLeft <= 0) {
      logout();
    }

    const timer = setTimeout(() => {
      setTimeLeft(calculateRemainingSeconds(expirationTime));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  });

  const refreshAuth = async () => {
    const newExpirationTime = await refreshCredentials();
    setExpirationTime(newExpirationTime);
    setTimeLeft(calculateRemainingSeconds(newExpirationTime));
    setShowTimeout(false);
  };

  const formatTime = (time: number) => {
    if (time > 60) {
      return `${moment.utc(time * 1000).format("mm:ss")} minutes`;
    }
    return `${Math.floor(time)} seconds`;
  };

  return (
    <Modal isOpen={showTimeout} onClose={refreshAuth}>
      <ModalOverlay />
      <ModalContent sx={sx.modalContent}>
        <ModalBody>
          <Text>
            Due to inactivity, you will be logged out in {formatTime(timeLeft)}.
          </Text>
        </ModalBody>
        <ModalFooter sx={sx.modalFooter}>
          <Button
            sx={sx.stayActive}
            onClick={refreshAuth}
            type="submit"
            data-testid="modal-refresh-button"
          >
            Stay Logged In
          </Button>
          <Button
            sx={sx.close}
            onClick={logout}
            type="submit"
            data-testid="modal-logout-button"
          >
            Log Out
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
    padding: "2rem",
  },
  modalFooter: {
    justifyContent: "flex-start",
    padding: "0",
    paddingTop: "2rem",
  },
  stayActive: {
    justifyContent: "center",
    marginTop: "1rem",
    marginRight: "2rem",
    minWidth: "7.5rem",
    span: {
      marginLeft: "0.5rem",
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
    padding: ".5rem 1rem",
    marginTop: "1rem",
    span: {
      marginLeft: "0rem",
      marginRight: "0.5rem",
    },
    ".mobile &": {
      fontSize: "sm",
      marginRight: "0",
    },
  },
};
