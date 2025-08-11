import {
  ChangeEvent,
  FormEvent,
  MouseEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
// components
import { Box, Button, Heading, Td, Text, Tr } from "@chakra-ui/react";
import {
  BackButton,
  EntityDetailsFormOverlay,
  EntityStatusIcon,
  Form,
  InstructionsAccordion,
  OverlayContext,
  PlanComplianceTableOverlay,
  ReportPageIntro,
  SaveReturnButton,
  Table,
} from "components";
// constants
import {
  nonCompliantValues,
  planComplianceStandardExceptionsLabel,
  planComplianceStandardKey,
} from "../../constants";
// types
import {
  AnyObject,
  EntityDetailsChildFormShape,
  EntityDetailsMultiformShape,
  EntityDetailsMultiformVerbiage,
  EntityDetailsTableVerbiage,
  EntityShape,
  EntityType,
  ReportShape,
  ScreenReaderCustomHeaderName,
} from "types";
// utils
import { isComplianceFormComplete, translateVerbiage } from "utils";

export const EntityDetailsMultiformOverlay = ({
  autosave = false,
  childForms,
  closeEntityDetailsOverlay,
  disabled,
  entityType,
  formData,
  forms,
  onSubmit,
  report,
  setEntering,
  setFormData,
  submitting,
  validateOnRender,
  verbiage,
}: Props) => {
  const { childFormId, selectedStandard, setChildFormId, setSelectedStandard } =
    useContext(OverlayContext);

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
    const translatedVerbiage = translateVerbiage(verbiage, {
      planName: formData?.name,
    }) as EntityDetailsMultiformVerbiage;

    const handleChildSubmit = (enteredData: AnyObject) => {
      setFormData({ ...formData, ...enteredData } as EntityShape);
      onSubmit(enteredData, false);
    };

    if (table) {
      const standards = report?.fieldData["standards"] || [];

      const { caption, sortableHeadRow, verbiage: tableVerbiage } = table;
      const translatedTableVerbiage = translateVerbiage(tableVerbiage, {
        planName: formData?.name,
      }) as EntityDetailsTableVerbiage;

      const tableProps = {
        caption,
        sortableHeadRow,
        verbiage: translatedTableVerbiage,
      };

      const handleTableSubmit = (enteredData: AnyObject) => {
        const standardId = selectedStandard?.entity.id;
        const standardKeyPrefix = `${planComplianceStandardKey}-${standardId}`;
        const allStandardKeys: string[] = [];
        const exceptionKeys: string[] = [];
        const nonComplianceKeys: string[] = [];

        // look through existing and new keys, because we may need to delete either
        const combinedData = { ...formData, ...enteredData };

        Object.keys(combinedData || {}).forEach((key) => {
          if (key.includes(standardKeyPrefix)) {
            allStandardKeys.push(key);

            if (key.includes(`${standardKeyPrefix}-exceptions`)) {
              exceptionKeys.push(key);
            } else if (key.includes(`${standardKeyPrefix}-nonCompliance`)) {
              nonComplianceKeys.push(key);
            }
          }
        });

        const standardCompliance = enteredData[standardKeyPrefix] || [];
        // No checkbox selected
        const isCompliant = standardCompliance.length === 0;
        const hasExceptions =
          standardCompliance[0]?.value ===
          planComplianceStandardExceptionsLabel;
        const updatedData = { ...enteredData };

        if (isCompliant) {
          // delete all standard keys
          allStandardKeys.forEach((key) => {
            delete formData?.[key];
            delete updatedData[key];
          });
        } else if (hasExceptions) {
          // delete nonCompliance if there are exceptions
          nonComplianceKeys.forEach((key) => {
            delete formData?.[key];
            delete updatedData[key];
          });
        } else {
          // delete exceptions if there is nonCompliance
          exceptionKeys.forEach((key) => {
            delete formData?.[key];
            delete updatedData[key];
          });
          // enteredData has the full form data for 438.68 so keep only 438.68 stuff from enteredData and not from formData
          nonComplianceKeys.forEach((key) => {
            delete formData?.[key];
          });
        }

        setFormData(formData);
        setSelectedStandard(null);
        handleChildSubmit(updatedData);
      };

      return (
        <PlanComplianceTableOverlay
          autosave={autosave}
          closeEntityDetailsOverlay={closeEntityDetailsOverlay}
          disabled={false}
          form={form}
          formData={formData}
          onSubmit={handleTableSubmit}
          report={report}
          standards={standards}
          submitting={submitting}
          table={tableProps}
          validateOnRender={validateOnRender || false}
          verbiage={translatedVerbiage}
        />
      );
    }

    const handleFormSubmit = (enteredData: AnyObject) => {
      handleChildSubmit(enteredData);
      closeEntityDetailsOverlay();
    };

    return (
      <EntityDetailsFormOverlay
        autosave={autosave}
        closeEntityDetailsOverlay={closeEntityDetailsOverlay}
        disabled={false}
        form={form}
        formData={formData}
        onSubmit={handleFormSubmit}
        submitting={submitting}
        sxOverride={sxOverride}
        validateOnRender={validateOnRender || false}
        verbiage={translatedVerbiage}
      />
    );
  };

  const ParentForms = () => {
    const formRefs = useRef<HTMLFormElement[]>([]);
    const [formCount, setFormCount] = useState<number>(0);
    const [formEnableDetails, setFormEnableDetails] = useState<{
      [key: string]: boolean;
    }>({});
    const [formCompletion, setFormCompletion] = useState<{
      [key: string]: boolean;
    }>({});
    const defaultEntity = {} as EntityShape;
    const [formEnteredData, setFormEnteredData] =
      useState<EntityShape>(defaultEntity);

    useEffect(() => {
      setEntering(false);
    }, []);

    useEffect(() => {
      const nonCompliantForms = {} as { [key: string]: boolean };
      const completedForms = {} as { [key: string]: boolean };

      for (const { form } of forms) {
        const formId = form.id;
        const assuranceField = `${formId}_assurance`;
        let isNonCompliant = false;
        let isFormComplete = false;

        if (formData?.[assuranceField]) {
          // Assurance has non-compliant answer, enable Enter button
          isNonCompliant = nonCompliantValues.has(
            formData[assuranceField][0]?.value
          );
          isFormComplete = isComplianceFormComplete(formData, formId);
        }

        completedForms[formId] = isFormComplete;
        nonCompliantForms[formId] = isNonCompliant;
      }

      setFormEnableDetails(nonCompliantForms);
      setFormCompletion(completedForms);
    }, [forms]);

    useEffect(() => {
      if (formCount === formRefs.current.length) {
        // Prevent UI from resetting while waiting for API
        const updatedData = { ...formData, ...formEnteredData };
        setFormData(updatedData);
        // Submit to API
        onSubmit(formEnteredData);
        // Reset
        setFormEnteredData(defaultEntity);
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
      updateEnableDetails[formId] = nonCompliantValues.has(event.target.value);
      setFormEnableDetails(updateEnableDetails);

      const changedData = {
        [inputId]: [{ key: event.target.id, value: event.target.value }],
      };
      const updatedData = {
        ...formData,
        ...changedData,
      } as EntityShape;
      setFormData(updatedData);
    };

    const handleSubmit = (enteredData: AnyObject) => {
      // Combine into one submission
      const data = { ...formEnteredData, ...enteredData };
      setFormEnteredData(data);
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
          <Box sx={sx.introContainer}>
            {heading && (
              <Heading as="h3" sx={sx.heading}>
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
      header?: string | ScreenReaderCustomHeaderName;
      text: string;
    }) => {
      const headerName =
        typeof header === "object" ? header.hiddenName : header;
      const hasDetailsEnabled = formEnableDetails[formId];
      const isComplete = formCompletion[formId];
      const is438206Form = formId === "planCompliance438206";

      switch (headerName) {
        case "Status": {
          if (hasDetailsEnabled && (is438206Form || !isComplete)) {
            return (
              <EntityStatusIcon
                entity={formData as EntityShape}
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
              disabled={!hasDetailsEnabled}
              onClick={() => getChildForm(formId)}
              sx={sx.tableButton}
              variant="outline"
            >
              {isComplete ? "Edit" : "Enter"}
            </Button>
          );
        }
        default:
          return (
            <>
              <Text sx={sx.tableData}>{text}</Text>
              {hasDetailsEnabled && !isComplete && (
                <Text sx={sx.errorText}>
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
            <Box key={`${formObject.form.id}`} sx={sx.container}>
              {formObject.verbiage && <Intro verbiage={formObject.verbiage} />}
              <Box sx={sx.introContainer}>
                <Form
                  autosave={autosave}
                  disabled={disabled}
                  dontReset={true}
                  formData={formData}
                  formJson={formObject.form}
                  id={formObject.form.id}
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
                  sx={sx.table}
                >
                  {formObject.table.bodyRows.map((row, rowIndex) => (
                    <Tr key={`${formObject.form.id}-${rowIndex}`}>
                      {row.map((cell: string, cellIndex: number) => (
                        <Td
                          key={`${formObject.form.id}-${rowIndex}-${cellIndex}}`}
                          sx={sx.tableCell}
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
  autosave?: boolean;
  childForms?: EntityDetailsChildFormShape[];
  closeEntityDetailsOverlay: MouseEventHandler;
  disabled: boolean;
  entityType: EntityType;
  formData?: EntityShape;
  forms: EntityDetailsMultiformShape[];
  onChange?: Function;
  onSubmit: Function;
  report?: ReportShape;
  setEntering: Function;
  setFormData: Function;
  submitting: boolean;
  validateOnRender?: boolean;
  verbiage: EntityDetailsMultiformVerbiage;
}

const sx = {
  container: {
    paddingTop: "1.75rem",
    "&:first-of-type": {
      borderTopColor: "gray_lighter",
      borderTopWidth: "1px",
    },
  },
  introContainer: {
    width: "100%",
    maxWidth: "30rem",
  },
  errorText: {
    color: "error_dark",
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
    borderColor: "gray_lighter",
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
      borderColor: "gray_lighter",
      color: "gray_lighter",
    },
  },
};

const sxOverride = {
  form: {
    "legend.ds-c-label": {
      color: "gray",
    },
  },
};
