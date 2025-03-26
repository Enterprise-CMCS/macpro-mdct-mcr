import React, { MouseEventHandler } from "react";
// components
import { Box } from "@chakra-ui/react";
import {
  BackButton,
  Form,
  ReportPageIntro,
  SaveReturnButton,
} from "components";
// types
import { EntityDetailsMultiformVerbiage, EntityShape, FormJson } from "types";

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
    <BackButton
      onClick={closeEntityDetailsOverlay}
      text={verbiage.backButton}
    />
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
    <SaveReturnButton
      disabled={disabled}
      disabledOnClick={closeEntityDetailsOverlay}
      formId={form.id}
      submitting={submitting}
    />
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
  form: {
    "legend.ds-c-label": {
      color: "palette.gray",
    },
  },
};
