import React, { MouseEventHandler, useEffect } from "react";
// components
import { Box, Button, Flex, Image, Spinner } from "@chakra-ui/react";
import { Form, ReportPageIntro } from "components";
// types
import {
  EntityDetailsMultiformShape,
  EntityDetailsOverlayMultiformVerbiage,
  EntityShape,
  EntityType,
} from "types";
// assets
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";

export const EntityDetailsOverlayMultiform = ({
  closeEntityDetailsOverlay,
  disabled,
  forms,
  onSubmit,
  selectedEntity,
  setEntering,
  submitting,
  validateOnRender,
  verbiage,
}: Props) => {
  useEffect(() => {
    setEntering(false);
  }, []);

  return (
    <Box>
      <Button
        sx={sx.backButton}
        variant="none"
        onClick={closeEntityDetailsOverlay as MouseEventHandler}
        aria-label={`${verbiage.backButton}`}
      >
        <Image src={arrowLeftBlue} alt="Arrow left" sx={sx.backIcon} />
        {verbiage.backButton}
      </Button>
      <ReportPageIntro text={verbiage.intro} />
      {forms.map((formObject: EntityDetailsMultiformShape, index: number) => (
        <Box key={`${formObject.form.id}-${index}`}>
          {formObject.verbiage?.intro && <Box>TODO: Show heading and hint</Box>}
          <Form
            id={formObject.form.id}
            formJson={formObject.form}
            onSubmit={onSubmit}
            formData={selectedEntity}
            autosave={true}
            disabled={disabled}
            validateOnRender={validateOnRender || false}
            dontReset={true}
          >
            {formObject.table && <Box>TODO: Table</Box>}
          </Form>
        </Box>
      ))}
      <Box sx={sx.footerBox}>
        <Flex sx={sx.buttonFlex}>
          {disabled ? (
            <Button
              variant="outline"
              onClick={closeEntityDetailsOverlay as MouseEventHandler}
            >
              Return
            </Button>
          ) : (
            <Button sx={sx.saveButton} onClick={() => onSubmit()}>
              {submitting ? <Spinner size="md" /> : "Save & return"}
            </Button>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

interface Props {
  closeEntityDetailsOverlay: Function;
  disabled: boolean;
  entityType: EntityType;
  forms: [EntityDetailsMultiformShape];
  onSubmit: Function;
  referrer?: string;
  selectedEntity?: EntityShape;
  setEntering: Function;
  submitting: boolean;
  validateOnRender?: boolean;
  verbiage: EntityDetailsOverlayMultiformVerbiage;
}

const sx = {
  overlayContainer: {
    backgroundColor: "palette.white",
    width: "100%",
  },
  backButton: {
    padding: 0,
    fontWeight: "normal",
    color: "palette.primary",
    display: "flex",
    position: "relative",
    right: "3rem",
    marginBottom: "2rem",
    marginTop: "-2rem",
  },
  backIcon: {
    color: "palette.primary",
    height: "1rem",
    marginRight: "0.5rem",
  },
  footerBox: {
    marginTop: "2rem",
    borderTop: "1.5px solid var(--chakra-colors-palette-gray_light)",
  },
  buttonFlex: {
    justifyContent: "end",
    marginY: "1.5rem",
  },
  saveButton: {
    width: "8.25rem",
  },
  textHeading: {
    fontWeight: "bold",
    lineHeight: "1.25rem",
  },
  programInfo: {
    ul: {
      margin: "0.5rem auto 0 auto",
      listStyleType: "none",
      li: {
        wordWrap: "break-word",
        whiteSpace: "break-spaces",
        fontSize: "xl",
        lineHeight: "1.75rem",
        "&:first-of-type": {
          fontWeight: "bold",
        },
      },
    },
  },
};
