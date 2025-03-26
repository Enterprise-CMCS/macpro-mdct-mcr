// components
import { Box, Button, Flex, Image, Spinner } from "@chakra-ui/react";
// assets
import nextIcon from "assets/icons/icon_next_white.png";
import { MouseEventHandler } from "react";

export const SaveReturnButton = ({
  border = true,
  disabled = false,
  disabledOnClick,
  formId,
  onClick,
  submitting = false,
}: Props) => {
  // formId is for a single form, onClick is for multiple forms/custom action
  const handlers = onClick ? { onClick } : { form: formId };

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
            {submitting ? <Spinner size="md" /> : "Save & return"}
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
    marginTop: "2rem",
  },
  footerBoxBorder: {
    borderTopColor: "palette.gray_lighter",
    borderTopWidth: "1px",
  },
  buttonFlex: {
    justifyContent: "end",
    marginY: "1.5rem",
  },
  saveButton: {
    width: "10.25rem",
  },
  arrowIcon: {
    width: "1rem",
  },
};
