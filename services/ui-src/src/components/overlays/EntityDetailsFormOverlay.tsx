import { MouseEventHandler } from "react";
// components
import { Box } from "@chakra-ui/react";
import {
  BackButton,
  Form,
  ReportPageIntro,
  SaveReturnButton,
} from "components";
// types
import {
  EntityDetailsMultiformVerbiage,
  EntityShape,
  FormJson,
  SxObject,
  TableContentShape,
} from "types";

export const EntityDetailsFormOverlay = ({
  closeEntityDetailsOverlay,
  disabled,
  form,
  onChange,
  onError,
  onSubmit,
  selectedEntity,
  submitting,
  sxOverride,
  table,
  validateOnRender,
  verbiage,
}: Props) => (
  <Box>
    <BackButton
      onClick={closeEntityDetailsOverlay}
      text={verbiage.backButton}
    />
    <ReportPageIntro
      accordion={verbiage.accordion}
      table={table}
      sxOverride={sxOverride}
      text={verbiage.intro}
    />
    <Box sx={{ ...sxOverride?.form }}>
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
  sxOverride?: SxObject;
  table?: TableContentShape;
  validateOnRender?: boolean;
  verbiage: EntityDetailsMultiformVerbiage;
}
