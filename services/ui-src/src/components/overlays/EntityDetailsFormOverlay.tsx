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
  AnyObject,
  EntityDetailsMultiformVerbiage,
  EntityShape,
  FormJson,
  TableContentShape,
} from "types";

export const EntityDetailsFormOverlay = ({
  autosave = false,
  closeEntityDetailsOverlay,
  disabled,
  form,
  formData,
  onChange,
  onError,
  onSubmit,
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
        autosave={autosave}
        disabled={disabled}
        dontReset={true}
        formData={formData}
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
  autosave?: boolean;
  closeEntityDetailsOverlay: MouseEventHandler;
  disabled: boolean;
  form: FormJson;
  formData?: EntityShape;
  onChange?: Function;
  onError?: Function;
  onSubmit: Function;
  submitting: boolean;
  sxOverride?: AnyObject;
  table?: TableContentShape;
  validateOnRender?: boolean;
  verbiage: EntityDetailsMultiformVerbiage;
}
