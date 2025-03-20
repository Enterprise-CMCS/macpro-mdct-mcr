import React, { MouseEventHandler } from "react";
// components
import { Box, Button, Flex, Image, Spinner } from "@chakra-ui/react";
import { Form, ReportPageIntro } from "components";
// types
import { EntityDetailsMultiformVerbiage, EntityShape, FormJson } from "types";
// assets
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";

export const EntityDetailsFormOverlay = ({
  closeEntityDetailsOverlay,
  disabled,
  form,
  onChange,
  onError,
  onSubmit,
  selectedEntity,
  submitting,
  validateOnRender,
  verbiage,
}: Props) => (
  <Box>
    <Button
      sx={sx.backButton}
      variant="none"
      onClick={closeEntityDetailsOverlay}
      aria-label={verbiage.backButton}
    >
      <Image src={arrowLeftBlue} alt="Arrow left" sx={sx.backIcon} />
      {verbiage.backButton}
    </Button>
    <ReportPageIntro text={verbiage.intro} accordion={verbiage.accordion} />
    <Box sx={sx.form}>
      <Form
        disabled={disabled}
        dontReset={true}
        formData={selectedEntity}
        formJson={form}
        id={form.id}
        onChange={onChange}
        onError={onError}
        onSubmit={onSubmit}
        validateOnRender={validateOnRender || false}
      />
    </Box>
    <Box sx={sx.footerBox}>
      <Flex sx={sx.buttonFlex}>
        {disabled ? (
          <Button variant="outline" onClick={closeEntityDetailsOverlay}>
            Return
          </Button>
        ) : (
          <Button type="submit" sx={sx.saveButton} form={form.id}>
            {submitting ? <Spinner size="md" /> : "Save & return"}
          </Button>
        )}
      </Flex>
    </Box>
  </Box>
);

interface Props {
  closeEntityDetailsOverlay: MouseEventHandler;
  disabled: boolean;
  form: FormJson;
  onChange?: Function;
  onError?: Function;
  onSubmit: Function;
  selectedEntity?: EntityShape;
  submitting: boolean;
  validateOnRender?: boolean;
  verbiage: EntityDetailsMultiformVerbiage;
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
  },
  form: {
    "legend.ds-c-label": {
      color: "palette.gray",
    },
  },
  buttonFlex: {
    justifyContent: "end",
    marginY: "1.5rem",
  },
  saveButton: {
    width: "8.25rem",
  },
};
