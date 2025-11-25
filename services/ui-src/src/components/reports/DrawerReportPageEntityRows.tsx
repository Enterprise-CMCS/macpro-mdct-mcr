import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
// types
import {
  DrawerReportPageShape,
  EntityShape,
  ModalOverlayReportPageShape,
  ReportShape,
} from "types";
// utils
import { buildDrawerReportPageEntityRows, useStore } from "utils";
// assets
import unfinishedIcon from "assets/icons/icon_error_circle_bright.png";
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
import completedIcon from "assets/icons/icon_check_circle.png";

export const DrawerReportPageEntityRows = ({
  entities,
  hasForm = true,
  openDeleteEntityModal,
  openRowDrawer,
  patientAccessDisabled = false,
  priorAuthDisabled = false,
  route,
  showStatusText = false,
}: Props) => {
  const { report = {} as ReportShape } = useStore();
  const { userIsEndUser = false } = useStore().user ?? {};

  const rows = buildDrawerReportPageEntityRows({
    entities,
    patientAccessDisabled,
    priorAuthDisabled,
    report,
    route,
    hasForm,
    userIsEndUser,
  });

  return (
    <>
      {rows.map((row: DrawerReportPageEntityRowProps) => (
        <Flex
          key={row.entity.id}
          sx={entityRowStyling(row.canAddEntities)}
          data-testid="report-drawer"
        >
          {row.showCompletionIcon && (
            <Image
              src={row.isEntityCompleted ? completedIcon : unfinishedIcon}
              alt={
                row.isEntityCompleted
                  ? "Entity is complete"
                  : "Entity is incomplete"
              }
              sx={sx.statusIcon}
            />
          )}
          <Flex direction={"column"} sx={sx.entityRow}>
            <Heading
              as="h4"
              sx={
                row.hasEntityNameWithDescription
                  ? sx.entityNameWithDescription
                  : sx.entityName
              }
            >
              {row.entityName}
            </Heading>
            {row.descriptionText && (
              <Text sx={sx.completeText}>{row.descriptionText}</Text>
            )}
            {showStatusText && row.completeText && (
              <Text sx={sx.completeText}>{row.completeText}</Text>
            )}
            {showStatusText && row.incompleteText && (
              <Text sx={sx.incompleteText}>{row.incompleteText}</Text>
            )}
          </Flex>
          <Box sx={buttonBoxStyling(row.canAddEntities)}>
            <Button
              sx={row.enterButton.disabled ? sx.disabledButton : sx.enterButton}
              onClick={() => openRowDrawer(row.entity)}
              variant="outline"
              disabled={row.enterButton.disabled}
              aria-label={row.enterButton.ariaLabel}
            >
              {row.enterButton.buttonText}
            </Button>
            {row.canAddEntities && !row.entity.isRequired && (
              <Button
                sx={sx.deleteButton}
                data-testid="delete-entity"
                onClick={() => openDeleteEntityModal(row.entity)}
              >
                <Image
                  src={deleteIcon}
                  alt={`Delete ${row.entityName}`}
                  boxSize="2xl"
                />
              </Button>
            )}
          </Box>
        </Flex>
      ))}
    </>
  );
};

interface Props {
  entities: EntityShape[];
  hasForm?: boolean;
  openDeleteEntityModal: Function;
  openRowDrawer: Function;
  patientAccessDisabled?: boolean;
  priorAuthDisabled?: boolean;
  route: DrawerReportPageShape | ModalOverlayReportPageShape;
  showStatusText?: boolean;
}

interface DrawerReportPageEntityRowProps {
  canAddEntities: boolean;
  completeText?: string;
  descriptionText?: string;
  entity: EntityShape;
  entityName: string;
  enterButton: {
    ariaLabel: string;
    buttonText: string;
    disabled: boolean;
  };
  hasEntityNameWithDescription: boolean;
  incompleteText?: string;
  isEntityCompleted: boolean;
  showCompletionIcon: boolean;
}

function entityRowStyling(canAddEntities: boolean) {
  return {
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "3.25rem",
    padding: "spacer1",
    paddingLeft: "spacer2",
    borderBottom: "1.5px solid var(--mdct-colors-gray_lighter)",
    "&:last-of-type": {
      borderBottom: canAddEntities ?? "none",
    },
  };
}

function buttonBoxStyling(canAddEntities: boolean) {
  return {
    marginRight: canAddEntities && "1.5rem",
  };
}

const sx = {
  statusIcon: {
    height: "1.25rem",
    position: "absolute",
  },
  entityRow: {
    paddingLeft: "2.25rem",
    maxWidth: "30rem",
    minHeight: "3.75rem",
    gap: "spacer_half",
    padding: "spacer1",
  },
  entityName: {
    fontSize: "lg",
    fontWeight: "bold",
    flexGrow: 1,
    marginLeft: "2.25rem",
    alignContent: "center",
  },
  entityNameWithDescription: {
    fontSize: "lg",
    fontWeight: "bold",
    flexGrow: 1,
    marginLeft: "2.25rem",
  },
  incompleteText: {
    color: "error_dark",
    fontSize: "sm",
    paddingLeft: "2.25rem",
  },
  completeText: {
    fontSize: "md",
    paddingLeft: "2.25rem",
    wordBreak: "break-word",
  },
  enterButton: {
    width: "5.75rem",
    height: "2.5rem",
    fontSize: "md",
    fontWeight: "bold",
  },
  deleteButton: {
    marginRight: "-2.5rem",
    padding: 0,
    background: "white",
    "&:hover, &:hover:disabled, :disabled": {
      background: "white",
    },
  },
  disabledButton: {
    width: "5.75rem",
    height: "2.5rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "gray_lighter",
    borderColor: "gray_lighter",
    "&:hover": {
      color: "gray_lighter",
      borderColor: "gray_lighter",
    },
  },
};
