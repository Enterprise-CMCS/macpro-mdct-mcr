import { useContext, useEffect, useState } from "react";
import uuid from "react-uuid";
import { useFieldArray, useFormContext } from "react-hook-form";
// components
import { Box, Button, Flex, Image, useDisclosure } from "@chakra-ui/react";
import {
  DeleteDynamicFieldRecordModal,
  ReportContext,
  TextField,
  EntityContext,
} from "components";
// styles
import { svgFilters } from "styles/theme";
// types
import {
  AnyObject,
  EntityType,
  EntityShape,
  InputChangeEvent,
  ReportStatus,
} from "types";
// utils
import {
  autosaveFieldData,
  filterStandardsAfterPlanDeletion,
  getAutosaveFields,
  useStore,
} from "utils";
// assets
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";

export const DynamicField = ({
  name,
  label,
  isRequired,
  autosave = true,
  ...props
}: Props) => {
  // state management
  const { full_name, state, userIsEndUser } = useStore().user ?? {};
  const { report, entities, entityType, selectedEntity } = useStore();

  const { updateReport } = useContext(ReportContext);
  const { updateEntities } = useContext(EntityContext);
  const [displayValues, setDisplayValues] = useState<EntityShape[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<EntityShape | undefined>(
    undefined
  );

  // get form context and register field
  const form = useFormContext();

  form.register(name);

  const openDeleteProgramModal = (index: number) => {
    setSelectedRecord(displayValues[index]);
    deleteProgramModalOnOpenHandler();
  };

  const {
    isOpen: deleteProgramModalIsOpen,
    onOpen: deleteProgramModalOnOpenHandler,
    onClose: deleteProgramModalOnCloseHandler,
  } = useDisclosure();

  // make formfield dynamic array with config options
  const { append, remove } = useFieldArray({
    name: name,
    shouldUnregister: true,
  });

  // update display value and form field data on change
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { id, value } = event.target;
    const currentEntity = displayValues.find((entity) => entity.id === id);
    const currentEntityIndex = displayValues.indexOf(currentEntity!);
    const newDisplayValues = [...displayValues];
    newDisplayValues[currentEntityIndex].name = value;
    if (isRequired) newDisplayValues[currentEntityIndex].isRequired = true;
    setDisplayValues(newDisplayValues);
  };

  // submit changed field data to database on blur
  const onBlurHandler = async () => {
    // trigger client-side validation so blank fields get client-side validation warning
    form.trigger(name);

    if (!autosave) {
      return;
    }

    // prepare args for autosave
    const fields = getAutosaveFields({
      name,
      type: "dynamic",
      value: displayValues,
      defaultValue: undefined,
      overrideCheck: true,
      hydrationValue,
    });
    const reportArgs = {
      id: report?.id,
      reportType: report?.reportType,
      updateReport,
      fieldData: report?.fieldData,
    };
    const user = { userName: full_name, state };

    await autosaveFieldData({
      form,
      fields,
      report: reportArgs,
      user,
      entityContext: {
        selectedEntity,
        entityType,
        updateEntities,
        entities,
      },
    });
  };

  const appendNewRecord = () => {
    const newEntity = { id: uuid(), name: "" };
    append(newEntity);
    const newDisplayValues = [...displayValues, newEntity];
    setDisplayValues(newDisplayValues);
  };

  // delete selected record from DB
  const deleteRecord = async (selectedRecord: EntityShape) => {
    if (userIsEndUser && autosave) {
      const reportKeys = {
        reportType: report?.reportType,
        state: state,
        id: report?.id,
      };

      // queue selected entity for deletion from DB
      const { [name]: entity } = form.getValues();
      const filteredEntities = entity.filter(
        (entity: AnyObject) => entity.id !== selectedRecord.id
      );

      // filter sanctions to exclude those related to selected entity
      const filteredSanctions = report?.fieldData?.sanctions?.filter(
        (entity: EntityShape) =>
          entity.sanction_planName.value !== selectedRecord.id
      );

      // filter analysis methods to remove deleted plans
      const filteredAnalysisMethods = report?.fieldData?.analysisMethods?.map(
        (originalMethod: EntityShape) => {
          const method = structuredClone(originalMethod);

          if (method.analysis_method_applicable_plans?.length) {
            method.analysis_method_applicable_plans = (
              method.analysis_method_applicable_plans || []
            ).filter((plan: AnyObject) => {
              const planKey: string = plan.key
                .split("analysis_method_applicable_plans-")
                .pop();
              return planKey !== selectedRecord.id;
            });
          }
          const analysisMethodNotUtilized =
            method.analysis_applicable?.[0]?.value === "No";

          const analysisMethodUtilizedWithoutPlans =
            method.analysis_applicable?.[0]?.value === "Yes" &&
            method.analysis_method_applicable_plans?.length === 0;

          const reportPlans = report.fieldData?.plans.filter(
            (plan: AnyObject) => {
              return plan.id !== selectedRecord.id;
            }
          );

          // revert not utilized analysis methods to unanswered state if there are no plans
          if (
            analysisMethodUtilizedWithoutPlans ||
            (analysisMethodNotUtilized && reportPlans.length === 0)
          ) {
            delete method.analysis_applicable;
          }

          const isCustomMethodWithNoPlans =
            "custom_analysis_method_name" in method &&
            method.analysis_method_applicable_plans?.length === 0;
          if (
            analysisMethodUtilizedWithoutPlans ||
            analysisMethodNotUtilized ||
            isCustomMethodWithNoPlans
          ) {
            delete method.analysis_method_applicable_plans;
            delete method.analysis_method_frequency;
            delete method["analysis_method_frequency-otherText"];
          }

          return method;
        }
      );
      // delete ILOS data from corresponding plans
      const filteredPlans =
        name === "plans"
          ? filteredEntities
          : report?.fieldData.plans?.map((entity: EntityShape) => {
              let newEntity = { ...entity };
              const planHasIlos =
                entity["plan_ilosOfferedByPlan"]?.[0]?.value.startsWith("Yes");

              if (name === "ilos" && planHasIlos) {
                const ilosUtilizationByPlan = [
                  ...newEntity["plan_ilosUtilizationByPlan"],
                ];

                const filteredUtilizationByPlan = ilosUtilizationByPlan?.filter(
                  (ilos) => {
                    return selectedRecord.id !== ilos.key;
                  }
                );
                newEntity = {
                  ...newEntity,
                  plan_ilosUtilizationByPlan: filteredUtilizationByPlan,
                };

                // delete associated ILOS response
                delete newEntity[
                  `plan_ilosUtilizationByPlan_${selectedRecord.id}`
                ];

                // if there's no ILOS, clear checked response
                if (!report?.fieldData["ilos"]?.length) {
                  delete newEntity["plan_ilosOfferedByPlan"];
                }
              }

              return newEntity;
            });

      // filter Standards after deletion of any plans
      const remainingPlanIds = report?.fieldData.plans?.map(
        (plan: { id: any }) => plan.id
      );

      const filteredStandards = filterStandardsAfterPlanDeletion(
        report?.fieldData?.standards,
        filteredAnalysisMethods,
        remainingPlanIds
      );

      const dataToWrite = {
        metadata: {
          status: ReportStatus.IN_PROGRESS,
          lastAlteredBy: full_name,
        },
        fieldData: {
          [name]: filteredEntities,
          sanctions: filteredSanctions,
          plans: filteredPlans,
          analysisMethods: filteredAnalysisMethods,
          standards: filteredStandards,
        },
      };

      await updateReport(reportKeys, dataToWrite);
    }
    removeRecord(selectedRecord);
  };

  // remove selected record from the UI
  const removeRecord = (selectedRecord: EntityShape) => {
    const index = displayValues.findIndex(
      (entity: EntityShape) => entity.id === selectedRecord.id
    );
    remove(index);
    let newDisplayValues = [...displayValues];
    newDisplayValues.splice(index, 1);
    if (newDisplayValues.length === 0) {
      const newEntity = { id: uuid(), name: "" };
      append(newEntity);
      newDisplayValues = [newEntity];
    }
    setDisplayValues(newDisplayValues);
    setSelectedRecord(undefined);
  };

  // set initial value to form field value or hydration value
  const hydrationValue = props?.hydrate;
  useEffect(() => {
    if (hydrationValue?.length) {
      // guard against autosave refresh error where user can change input values while save operation is still in progress (https://bit.ly/3kiE2eE)
      const newInputAdded = displayValues?.length > hydrationValue?.length;
      const existingInputChanged =
        displayValues?.length === hydrationValue?.length &&
        displayValues !== hydrationValue;
      const valuesToSet =
        newInputAdded || existingInputChanged ? displayValues : hydrationValue;
      // set and append values
      setDisplayValues(valuesToSet);
    } else {
      appendNewRecord();
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

  // on displayValue change, set field array value to match
  useEffect(() => {
    form.setValue(name, displayValues, { shouldValidate: true });
  }, [displayValues]);

  const fieldErrorState: AnyObject | undefined =
    form?.formState?.errors?.[name];

  return (
    <Box>
      {displayValues.map((field: EntityShape, index: number) => {
        return (
          <Flex key={field.id} sx={sx.dynamicField}>
            <TextField
              id={field.id}
              name={`${name}[${index}]`}
              label={label}
              errorMessage={fieldErrorState?.[index]?.name?.message}
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
              value={field.name}
              sxOverride={sx.textField}
              {...props}
            />
            <Box sx={sx.removeBox}>
              <button
                type="button"
                onClick={() => openDeleteProgramModal(index)}
                data-testid="removeButton"
              >
                {!props?.disabled && (
                  <Image
                    sx={sx.removeImage}
                    src={cancelIcon}
                    alt={`Delete ${field.name}`}
                  />
                )}
              </button>
            </Box>
          </Flex>
        );
      })}
      {!props.disabled && (
        <Button
          variant="outline"
          sx={sx.appendButton}
          onClick={appendNewRecord}
        >
          {name.includes("measure_rates") ? "Add another rate" : "Add a row"}
        </Button>
      )}
      <DeleteDynamicFieldRecordModal
        selectedRecord={selectedRecord}
        deleteRecord={deleteRecord}
        entityType={name}
        modalDisclosure={{
          isOpen: deleteProgramModalIsOpen,
          onClose: deleteProgramModalOnCloseHandler,
        }}
      />
    </Box>
  );
};

interface Props {
  name: EntityType;
  label: string;
  isRequired?: boolean;
  autosave?: boolean;
  [key: string]: any;
}

const sx = {
  removeBox: {
    marginBottom: "0.625rem",
    marginLeft: "0.625rem",
  },
  removeImage: {
    width: "1.25rem",
    height: "1.25rem",
    _hover: {
      filter: svgFilters.primary_darker,
    },
  },
  appendButton: {
    width: "12.5rem",
    height: "2.5rem",
    marginTop: "spacer4",
  },
  dynamicField: {
    alignItems: "flex-end",
    ".desktop &": {
      width: "32rem",
    },
    ".tablet &": {
      width: "29rem",
    },
    ".ds-u-clearfix": {
      width: "100%",
    },
    "&:not(:first-of-type)": {
      paddingTop: "spacer4",
    },
  },
  textField: {
    width: "100%",
    label: {
      marginTop: "0",
    },
  },
};
