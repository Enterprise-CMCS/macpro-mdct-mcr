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
  const [formData, setFormData] = useState<AnyObject>({});

  useEffect(() => {
    setEntering(false);
  }, []);

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
    header,
    text,
  }: {
    header?: string | ScreenReaderOnlyHeaderName;
    text: string;
  }) => {
    const headerName = typeof header === "object" ? header.hiddenName : header;

    switch (headerName) {
      case "Status":
        return (
          <EntityStatusIcon
            entity={selectedEntity as EntityShape}
            entityType={entityType}
          />
        );
      case "Action":
        return (
          <Button variant="outline" disabled={true}>
            Enter
          </Button>
        );
      default:
        return (
          <Text as="span" sx={sx.plan.tableData}>
            {text}
          </Text>
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
                          text={cell}
                          header={formObject.table?.headRow[cellIndex]}
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
    heading: {
      fontSize: "1.3rem",
    },
    table: {
      marginBottom: "1.5rem",
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
  },
};
