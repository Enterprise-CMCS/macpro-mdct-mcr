import React, { MouseEventHandler, useEffect } from "react";
// components
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Spinner,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import {
  Form,
  InstructionsAccordion,
  ReportPageIntro,
  Table,
} from "components";
// types
import {
  EntityDetailsMultiformShape,
  EntityDetailsMultiformVerbiage,
  EntityShape,
  EntityType,
} from "types";
// assets
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";

const Intro = ({ verbiage }: { verbiage: EntityDetailsMultiformVerbiage }) => {
  const { heading, hint, accordion } = verbiage;

  return (
    <Box>
      {heading && (
        <Heading as="h3" sx={sx.plan.heading}>
          {heading}
        </Heading>
      )}
      {hint && <Text>{hint}</Text>}
      {accordion && <InstructionsAccordion verbiage={accordion} />}
    </Box>
  );
};

export const EntityDetailsMultiformOverlay = ({
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
      <Box>
        {forms.map((formObject: EntityDetailsMultiformShape) => (
          <Box key={`${formObject.form.id}`} sx={sx.plan.container}>
            {formObject.verbiage && <Intro verbiage={formObject.verbiage} />}
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
              {formObject.table && (
                <Table
                  content={{
                    headRow: formObject.table.headRow,
                    caption: formObject.table.caption,
                  }}
                >
                  {formObject.table.bodyRows.map((row, rowIndex) => {
                    <Tr key={`${formObject.form.id}-${rowIndex}`}>
                      {row.map((cell: string, cellIndex: number) => {
                        <Td
                          key={`${formObject.form.id}-${rowIndex}-${cellIndex}}`}
                        >
                          {cell}
                        </Td>;
                      })}
                    </Tr>;
                  })}
                </Table>
              )}
            </Form>
          </Box>
        ))}
      </Box>
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
  selectedEntity?: EntityShape;
  setEntering: Function;
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
  buttonFlex: {
    justifyContent: "end",
    marginY: "1.5rem",
  },
  saveButton: {
    width: "8.25rem",
  },
  plan: {
    container: {
      paddingTop: "1.75rem",
      "&:first-child": {
        borderTopColor: "palette.gray_lighter",
        borderTopWidth: "1px",
      },
    },
    heading: {
      fontSize: "1.3rem",
    },
  },
};
