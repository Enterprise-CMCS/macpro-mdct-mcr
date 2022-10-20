import { useContext, useEffect, useState } from "react";
import uuid from "react-uuid";
import { useFieldArray, useFormContext } from "react-hook-form";
// components
import { Box, Button, Flex, Image, useDisclosure } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { DeleteDynamicFieldRecordModal, ReportContext } from "components";
import { svgFilters } from "styles/theme";
// utils
import { EntityShape, EntityType, InputChangeEvent, ReportStatus } from "types";
import { useUser } from "utils";
// assets
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";
import { AnyObject } from "yup/lib/object";

export const DynamicField = ({ name, label, ...props }: Props) => {
  // get form context and register field
  const form = useFormContext();
  form.register(name);
  const { full_name, state, userIsStateUser, userIsStateRep } =
    useUser().user ?? {};
  const { report, updateReport } = useContext(ReportContext);
  const [displayValues, setDisplayValues] = useState<EntityShape[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<EntityShape | undefined>(
    undefined
  );

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
    setDisplayValues(newDisplayValues);
  };

  const appendNewRecord = () => {
    const newEntity = { id: uuid(), name: "" };
    append(newEntity);
    const newDisplayValues = [...displayValues, newEntity];
    setDisplayValues(newDisplayValues);
  };

  // delete selected record from DB
  const deleteRecord = async (selectedRecord: EntityShape) => {
    if (userIsStateUser || userIsStateRep) {
      const reportKeys = {
        state: state,
        id: report?.id,
      };

      let filteredEntities = {};
      if (name === "plans") {
        filteredEntities = {
          [name]: form
            .getValues()
            .plans.filter((plan: AnyObject) => plan.id !== selectedRecord.id),
        };
      } else if (name === "bssEntities") {
        filteredEntities = {
          [name]: form
            .getValues()
            .bssEntities.filter(
              (bssEntity: AnyObject) => bssEntity.id !== selectedRecord.id
            ),
        };
      }

      const dataToWrite = {
        status: ReportStatus.IN_PROGRESS,
        lastAlteredBy: full_name,
        fieldData: filteredEntities,
      };

      // delete related sanctions and quality measures
      if (report?.fieldData.sanctions) {
        const filteredSanctions = {
          ["sanctions"]: report.fieldData.sanctions.filter(
            (sanction: EntityShape) =>
              sanction.sanction_planName.value !== selectedRecord.id
          ),
        };
        const dataToWrite = {
          status: ReportStatus.IN_PROGRESS,
          lastAlteredBy: full_name,
          fieldData: filteredSanctions,
        };
        await updateReport(reportKeys, dataToWrite);
      }

      // TODO: Delete related quality measures

      removeRecord(selectedRecord);
      await updateReport(reportKeys, dataToWrite);
    }
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
    if (hydrationValue) {
      setDisplayValues(hydrationValue);
      append(hydrationValue);
    } else {
      appendNewRecord();
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

  // on displayValue change, set field array value to match
  useEffect(() => {
    form.setValue(name, displayValues, { shouldValidate: true });
  }, [displayValues]);

  const fieldErrorState = form?.formState?.errors?.[name];

  return (
    <Box>
      {displayValues.map((field: EntityShape, index: number) => {
        return (
          <Flex key={field.id} sx={sx.textField}>
            <CmsdsTextField
              id={field.id}
              name={`${name}[${index}]`}
              label={label}
              errorMessage={fieldErrorState?.[index]?.name.message}
              onChange={(e) => onChangeHandler(e)}
              value={field.name}
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
                    alt="Remove item"
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
          Add a row
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
    marginTop: "2rem",
  },
  textField: {
    alignItems: "flex-end",
    width: "32rem",
    ".ds-u-clearfix": {
      width: "100%",
    },
  },
};
