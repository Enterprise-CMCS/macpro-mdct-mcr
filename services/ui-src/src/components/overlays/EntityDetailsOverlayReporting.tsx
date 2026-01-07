import { MouseEventHandler } from "react";
// components
import { Box, Text } from "@chakra-ui/react";
import { Form, ReportPageIntro, SaveReturnButton } from "components";
// types
import { EntityShape, EntityType, FormJson } from "types";
// utils
import { getProgramInfo } from "utils";
// verbiage
import accordionVerbiage from "verbiage/pages/accordion";
import overlayVerbiage from "verbiage/pages/overlays";

export const EntityDetailsOverlayReporting = ({
  closeEntityDetailsOverlay,
  disabled,
  form = {} as FormJson,
  onSubmit,
  selectedEntity,
  submitting,
  validateOnRender,
}: Props) => {
  const programInfo = getProgramInfo(selectedEntity);

  return (
    <>
      <ReportPageIntro
        text={overlayVerbiage.MLR.intro}
        accordion={accordionVerbiage.MLR.detailIntro}
      />
      <Box sx={sx.programInfo}>
        <Text sx={sx.textHeading}>MLR report for:</Text>
        <ul>
          {programInfo.map((field, index) => (
            <li key={index}>{field}</li>
          ))}
        </ul>
      </Box>
      <Form
        autosave={true}
        disabled={disabled}
        dontReset={true}
        formData={selectedEntity}
        formJson={form}
        id={form.id}
        onSubmit={onSubmit}
        validateOnRender={validateOnRender || false}
      />
      <SaveReturnButton
        disabled={disabled}
        disabledOnClick={closeEntityDetailsOverlay}
        formId={form.id}
        submitting={submitting}
      />
    </>
  );
};

interface Props {
  closeEntityDetailsOverlay: MouseEventHandler;
  entityType: EntityType;
  disabled: boolean;
  entities: EntityShape[];
  drawerForm?: FormJson;
  form?: FormJson;
  onSubmit: Function;
  selectedEntity: EntityShape;
  submitting?: boolean;
  validateOnRender?: boolean;
}

const sx = {
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
