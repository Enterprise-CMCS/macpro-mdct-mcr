import React, {
  ChangeEvent,
  FormEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
// components
import { Box, Button, Heading, Td, Text, Tr } from "@chakra-ui/react";
import {
  EntityDetailsFormOverlay,
  PlanComplianceTableOverlay,
  EntityStatusIcon,
  Form,
  InstructionsAccordion,
  ReportPageIntro,
  Table,
  SaveReturnButton,
  BackButton,
} from "components";
// constants
import { nonCompliantLabel } from "../../constants";
// types
import {
  AnyObject,
  EntityDetailsChildFormShape,
  EntityDetailsMultiformShape,
  EntityDetailsMultiformVerbiage,
  EntityDetailsTableVerbiage,
  EntityShape,
  EntityType,
  ScreenReaderOnlyHeaderName,
} from "types";
// utils
import { translateVerbiage, useStore } from "utils";

export const EntityDetailsMultiformOverlay = ({
  childForms,
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
  const [childFormId, setChildFormId] = useState<string | null>(null);

  const ChildForm = () => {
    const formObject = childForms?.find(
      (form: EntityDetailsChildFormShape) => form.parentForm === childFormId
    );

    const closeEntityDetailsOverlay = () => {
      setChildFormId(null);
    };

    useEffect(() => {
      if (!formObject) {
        closeEntityDetailsOverlay();
      }
    }, [formObject]);

    if (!formObject) {
      return <></>;
    }

    const { form, table, verbiage } = formObject;
    const tranlatedVerbiage = translateVerbiage(verbiage, {
      planName: selectedEntity?.name,
    }) as EntityDetailsMultiformVerbiage;

    const handleSubmit = (enteredData: AnyObject) => {
      const updatedEntity = { ...selectedEntity, ...enteredData };
      setSelectedEntity(updatedEntity);
      onSubmit(enteredData, false);
    };

    if (table) {
      const { report } = useStore();
      const entities = report?.fieldData["standards"] || [];

      const { caption, sortableHeadRow, verbiage: tableVerbiage } = table;
      const translatedTableVerbiage = translateVerbiage(tableVerbiage, {
        planName: selectedEntity?.name,
      }) as EntityDetailsTableVerbiage;

      const tableProps = {
        caption,
        sortableHeadRow,
        verbiage: translatedTableVerbiage,
      };

      // TODO: Handle submit
      return (
        <PlanComplianceTableOverlay
          closeEntityDetailsOverlay={closeEntityDetailsOverlay}
          disabled={false}
          entities={entities}
          form={form}
          onSubmit={() => {}}
          selectedEntity={selectedEntity}
          submitting={submitting}
          table={tableProps}
          validateOnRender={validateOnRender || false}
          verbiage={tranlatedVerbiage}
        />
      );
    }

    return (
      <EntityDetailsFormOverlay
        closeEntityDetailsOverlay={closeEntityDetailsOverlay}
        disabled={false}
        form={form}
        onSubmit={handleSubmit}
        selectedEntity={selectedEntity}
        submitting={submitting}
        validateOnRender={validateOnRender || false}
        verbiage={tranlatedVerbiage}
      />
    );
  };

  const ParentForms = () => {
    const formRefs = useRef<HTMLFormElement[]>([]);
    const [formCount, setFormCount] = useState<number>(0);
    const [formEnableDetails, setFormEnableDetails] = useState<{
      [key: string]: boolean;
    }>({});
    const [formHasComplianceDetails, setFormHasComplianceDetails] = useState<{
      [key: string]: boolean;
    }>({});
    const [formData, setFormData] = useState<AnyObject>({});

    useEffect(() => {
      setEntering(false);
    }, []);

    useEffect(() => {
      const formIds = forms.map((formObject) => formObject.form.id);
      const nonCompliantForms = {} as { [key: string]: boolean };
      const hasComplianceDetailsForms = {} as { [key: string]: boolean };

      formIds.forEach((formId) => {
        const assuranceField = `${formId}_assurance`;
        let assuranceNonCompliant = false;
        hasComplianceDetailsForms[formId] = false;

        if (selectedEntity && selectedEntity[assuranceField]) {
          // Assurance has non-compliant answer
          assuranceNonCompliant =
            selectedEntity[assuranceField][0]?.value === nonCompliantLabel;

          if (assuranceNonCompliant) {
            const complianceDetailFields = Object.keys(selectedEntity).filter(
              (key) => key.startsWith(formId) && selectedEntity[key] !== null
            );
            // Should have multiple compliance details
            hasComplianceDetailsForms[formId] =
              complianceDetailFields.length > 1;
          }
        }

        nonCompliantForms[formId] = assuranceNonCompliant;
      });

      setFormEnableDetails(nonCompliantForms);
      setFormHasComplianceDetails(hasComplianceDetailsForms);
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

    const getChildForm = (formId: string) => {
      window.scrollTo(0, 0);
      setChildFormId(formId);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const updateEnableDetails = { ...formEnableDetails };
      // Assuming id is in formId_fieldId-optionId format
      const formId = event.target.id.split("_")[0];
      const inputId = event.target.id.split("-")[0];
      updateEnableDetails[formId] = event.target.value === nonCompliantLabel;
      setFormEnableDetails(updateEnableDetails);

      const changedData = {
        [inputId]: [{ key: event.target.id, value: event.target.value }],
      };
      const updatedEntity = { ...selectedEntity, ...changedData };
      setSelectedEntity(updatedEntity);
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
          <Box sx={sx.plan.introContainer}>
            {heading && (
              <Heading as="h3" sx={sx.plan.heading}>
                {heading}
              </Heading>
            )}
            {hint && <Text>{hint}</Text>}
          </Box>
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
      const headerName =
        typeof header === "object" ? header.hiddenName : header;
      const isEnabled = formEnableDetails[formId];
      const isComplete = formHasComplianceDetails[formId];

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
          return (
            <Button
              disabled={!isEnabled}
              onClick={() => getChildForm(formId)}
              sx={sx.plan.tableButton}
              variant="outline"
            >
              {isComplete ? "Edit" : "Enter"}
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
        <BackButton
          onClick={closeEntityDetailsOverlay}
          text={verbiage.backButton}
        />
        <ReportPageIntro text={verbiage.intro} />
        <Box>
          {forms.map((formObject: EntityDetailsMultiformShape, index) => (
            <Box key={`${formObject.form.id}`} sx={sx.plan.container}>
              {formObject.verbiage && <Intro verbiage={formObject.verbiage} />}
              <Box sx={sx.plan.introContainer}>
                <Form
                  disabled={disabled}
                  dontReset={true}
                  formData={selectedEntity}
                  formJson={formObject.form}
                  id={formObject.form.id}
                  name={formObject.form.id}
                  onChange={handleChange}
                  onSubmit={(data: AnyObject) => handleSubmit(data)}
                  ref={(el) =>
                    (formRefs.current[index] = el as HTMLFormElement)
                  }
                  validateOnRender={validateOnRender || false}
                />
              </Box>
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
        <SaveReturnButton
          disabled={disabled}
          disabledOnClick={closeEntityDetailsOverlay}
          border={false}
          onClick={submitForms}
          submitting={submitting}
        />
      </Box>
    );
  };

  return childFormId ? <ChildForm /> : <ParentForms />;
};

interface Props {
  childForms?: EntityDetailsChildFormShape[];
  closeEntityDetailsOverlay: MouseEventHandler;
  disabled: boolean;
  entityType: EntityType;
  forms: EntityDetailsMultiformShape[];
  onChange?: Function;
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
  plan: {
    container: {
      paddingTop: "1.75rem",
      "&:first-of-type": {
        borderTopColor: "palette.gray_lighter",
        borderTopWidth: "1px",
      },
    },
    introContainer: {
      width: "100%",
      maxWidth: "30rem",
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
      width: "6rem",
      "&:disabled": {
        borderColor: "palette.gray_lighter",
        color: "palette.gray_lighter",
      },
    },
  },
};
