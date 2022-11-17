import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  ModalContent,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { refreshCredentials, updateTimeout, useUser } from "utils";
import { PROMPT_AT } from "../../constants";
import moment from "moment";

const calculateTimeLeft = (expiresAt: any) => {
  if (!expiresAt) return 0;
  return moment(expiresAt).diff(moment()) / 1000;
};

export const Timeout = () => {
  const { logout, getExpiration } = useUser();
  const initialExpiration = getExpiration();
  const [expiration, setExpiration] = useState(initialExpiration);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(expiration));
  const [showTimeout, setShowTimeout] = useState(false);
  const location = useLocation();

  useEffect(() => {
    updateTimeout();
    const newExpiration = getExpiration();
    setExpiration(newExpiration);
    setTimeLeft(calculateTimeLeft(newExpiration));
  }, [location]);

  useEffect(() => {
    if (timeLeft * 1000 < PROMPT_AT) {
      setShowTimeout(true);
    }

    if (timeLeft <= 0) {
      localStorage.removeItem("mdctmcr_session_exp");
      logout();
    }
    // eslint-disable-next-line no-unused-vars
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(expiration));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  });

  const logoutClick = () => {
    logout();
  };

  const refreshAuth = async () => {
    const newExpiration = await refreshCredentials();
    setExpiration(newExpiration);
    setTimeLeft(calculateTimeLeft(newExpiration));
    setShowTimeout(false);
  };

  const formatTime = (time: number) => {
    if (time > 60) {
      return `${moment.utc(time * 1000).format("mm:ss")} minutes`;
    }
    return `${Math.floor(time)} seconds`;
  };

  if (!showTimeout) return <></>;

  return (
    <Modal isOpen={true} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent sx={sx.modalContent}>
        <ModalBody>
          <p>
            Due to inactivity, you will be logged out in {formatTime(timeLeft)}.
          </p>
        </ModalBody>
        <ModalFooter sx={sx.modalFooter}>
          <Button
            sx={sx.stayActive}
            onClick={refreshAuth}
            type="submit"
            data-testid="modal-submit-button"
          >
            Stay active
          </Button>
          <Button
            sx={sx.close}
            onClick={logoutClick}
            type="submit"
            data-testid="modal-submit-button"
          >
            Logout
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
