import { MouseEventHandler } from "react";
// components
import { Box, Button, Flex, Image, Spinner } from "@chakra-ui/react";
// assets
import nextIcon from "assets/icons/icon_next_white.png";
import { useStore } from "utils";

export const SaveReturnButton = ({
  border = true,
  disabled = false,
  disabledOnClick,
  formId,
  onClick,
  submitting = false,
}: Props) => {
  const { userIsEndUser } = useStore().user ?? {};
  // formId is for a single form, onClick is for multiple forms/custom action

  const handlers =
    // prevent submit for admin or read-only user
    !userIsEndUser
      ? { onClick: disabledOnClick }
      : onClick
      ? { onClick }
      : { form: formId! };

  const buttonText = !userIsEndUser ? "Return" : "Save & return";
  return (
    <Box sx={{ ...sx.footerBox, ...(border && sx.footerBoxBorder) }}>
      <Flex sx={sx.buttonFlex}>
        {disabled && (
          <Button variant="outline" onClick={disabledOnClick}>
            Return
          </Button>
        )}
        {!disabled && (
          <Button
            rightIcon={
              !submitting ? (
                <Image src={nextIcon} alt="Next" sx={sx.arrowIcon} />
              ) : undefined
            }
            sx={sx.saveButton}
            type="submit"
            {...handlers}
          >
            {submitting ? <Spinner size="md" /> : buttonText}
          </Button>
        )}
      </Flex>
    </Box>
  );
};

interface Props {
  border?: boolean;
  disabled?: boolean;
  disabledOnClick?: MouseEventHandler;
  formId?: string;
  onClick?: MouseEventHandler;
  submitting?: boolean;
}

const sx = {
  footerBox: {
    marginTop: "spacer4",
  },
  footerBoxBorder: {
    borderTopColor: "gray_lighter",
    borderTopWidth: "1px",
  },
  buttonFlex: {
    justifyContent: "end",
    marginY: "spacer3",
  },
  saveButton: {
    width: "10.25rem",
  },
  arrowIcon: {
    width: "1rem",
  },
};
