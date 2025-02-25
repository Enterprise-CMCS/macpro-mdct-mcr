import React, {
  FormEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
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
  EntityStatusIcon,
  Form,
  InstructionsAccordion,
  ReportPageIntro,
  Table,
} from "components";
// types
import {
  AnyObject,
  EntityDetailsMultiformShape,
  EntityDetailsMultiformVerbiage,
  EntityShape,
  EntityType,
  ScreenReaderOnlyHeaderName,
} from "types";
// assets
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";

export const EntityDetailsMultiformOverlay = ({
  closeEntityDetailsOverlay,
  disabled,
  entityType,
  forms,
  onSubmit,
  selectedEntity,
  setEntering,
  setSelectedEntity,
  submitting,
  validateOnRender,
  verbiage,
}: Props) => {
  const formRefs = useRef<HTMLFormElement[]>([]);
  const [formCount, setFormCount] = useState<number>(0);
  const [formEnabled, setFormEnabled] = useState<AnyObject>({});
  const [formComplete, setFormComplete] = useState<AnyObject>({});
  const [formData, setFormData] = useState<AnyObject>({});
  const NOT_COMPLIANT_LABEL =
    "No, the plan does not comply on all standards based on all analyses and/or exceptions granted";

  useEffect(() => {
    setEntering(false);
  }, []);

  useEffect(() => {
    const formIds = forms.map((form) => form.form.id);
    const enabled = {} as AnyObject;
    const complete = {} as AnyObject;

    formIds.forEach((formId) => {
      const assuranceField = `${formId}_assurance`;
      let enableForm = false;

      if (selectedEntity && selectedEntity[assuranceField]) {
        enableForm =
          selectedEntity[assuranceField][0]?.value === NOT_COMPLIANT_LABEL;
      }

      enabled[formId] = enableForm;
      // TODO: Update with actual logic
      complete[formId] = false;
    });

    setFormComplete(complete);
    setFormEnabled(enabled);
  }, [forms]);

  useEffect(() => {
    if (formCount === formRefs.current.length) {
      // Prevent UI from resetting while waiting for API
      const updatedEntity = { ...selectedEntity, ...formData };
      setSelectedEntity(updatedEntity);
      // Submit to API
      onSubmit(formData);
      // Reset
      setFormData({});
      setFormCount(0);
    }
  }, [formCount]);

  const handlChange = (event: AnyObject) => {
    const updateFormEnabled = { ...formEnabled };
    const formId = event.target.id.split("_")[0];
    updateFormEnabled[formId] = event.target.value === NOT_COMPLIANT_LABEL;
    setFormEnabled(updateFormEnabled);
  };

  const handleSubmit = (enteredData: AnyObject) => {
    // Combine into one submission
    const data = { ...formData, ...enteredData };
    setFormData(data);
    setFormCount(formCount + 1);
  };

  const submitForms = (event: FormEvent) => {
    event.preventDefault();

    formRefs.current.forEach((form, index) => {
      // Stagger form submission
      setTimeout(() => {
        form.requestSubmit();
      }, 100 * index);
    });
  };

  const Intro = ({
    verbiage,
  }: {
    verbiage: EntityDetailsMultiformVerbiage;
  }) => {
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

  const Cell = ({
    formId,
    header,
    text,
  }: {
    formId: string;
    header?: string | ScreenReaderOnlyHeaderName;
    text: string;
  }) => {
    const headerName = typeof header === "object" ? header.hiddenName : header;
    const isEnabled = formEnabled[formId];
    const isComplete = formComplete[formId];

    switch (headerName) {
      case "Status": {
        if (isEnabled) {
          return (
            <EntityStatusIcon
              entity={selectedEntity as EntityShape}
              entityType={entityType}
              override={isComplete}
            />
          );
        }
        return <></>;
      }
      case "Action": {
        // TODO: Update with actual logic
        const updatedFormComplete = { ...formComplete };
        updatedFormComplete[formId] = true;

        return (
          <Button
            disabled={!isEnabled}
            onClick={() => setFormComplete(updatedFormComplete)}
            sx={sx.plan.tableButton}
            variant="outline"
          >
            Enter
          </Button>
        );
      }
      default:
        return (
          <>
            <Text sx={sx.plan.tableData}>{text}</Text>
            {isEnabled && !isComplete && (
              <Text sx={sx.plan.errorText}>
                Select “Enter” to complete response.
              </Text>
            )}
          </>
        );
    }
  };

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
        {forms.map((formObject: EntityDetailsMultiformShape, index) => (
          <Box key={`${formObject.form.id}`} sx={sx.plan.container}>
            {formObject.verbiage && <Intro verbiage={formObject.verbiage} />}
            <Form
              autosave={false}
              disabled={disabled}
              dontReset={true}
              formData={selectedEntity}
              formJson={formObject.form}
              id={formObject.form.id}
              onChange={handlChange}
              onSubmit={(data: AnyObject) => handleSubmit(data)}
              ref={(el) => (formRefs.current[index] = el as HTMLFormElement)}
              validateOnRender={validateOnRender || false}
            ></Form>
            {formObject.table && (
              <Table
                content={{
                  headRow: formObject.table.headRow,
                  caption: formObject.table.caption,
                }}
                sx={sx.plan.table}
              >
                {formObject.table.bodyRows.map((row, rowIndex) => (
                  <Tr key={`${formObject.form.id}-${rowIndex}`}>
                    {row.map((cell: string, cellIndex: number) => (
                      <Td
                        key={`${formObject.form.id}-${rowIndex}-${cellIndex}}`}
                        sx={sx.plan.tableCell}
                      >
                        <Cell
                          formId={formObject.form.id}
                          header={formObject.table?.headRow[cellIndex]}
                          text={cell}
                        />
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Table>
            )}
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
            <Button type="submit" sx={sx.saveButton} onClick={submitForms}>
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
  setSelectedEntity: Function;
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
      "&:first-of-type": {
        borderTopColor: "palette.gray_lighter",
        borderTopWidth: "1px",
      },
    },
    errorText: {
      color: "palette.error_dark",
      fontSize: "0.75rem",
      marginTop: "0.25rem",
    },
    heading: {
      fontSize: "1.3rem",
    },
    table: {
      marginBottom: "1.5rem",
      maxWidth: "36.125rem",
      td: {
        paddingRight: "0",
      },
      th: {
        "&:nth-of-type(1)": {
          width: "2.5rem",
        },
        "&:nth-of-type(3)": {
          width: "8rem",
        },
      },
    },
    tableCell: {
      borderColor: "palette.gray_lighter",
    },
    tableData: {
      display: "block",
      fontSize: "1rem",
      fontWeight: "bold",
      lineHeight: "1.5rem",
      maxWidth: "19rem",
    },
    tableButton: {
      "&:disabled": {
        borderColor: "palette.gray_lighter",
        color: "palette.gray_lighter",
      },
    },
  },
};
