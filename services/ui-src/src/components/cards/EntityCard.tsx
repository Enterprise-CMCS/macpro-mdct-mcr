// components
import { Card } from "components";
import { Box, Button, Heading, Image, Text } from "@chakra-ui/react";
// utils
import { AnyObject } from "types";
// assets
import { svgFilters } from "styles/theme";
import completedIcon from "assets/icons/icon_check_circle.png";
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
import editIcon from "assets/icons/icon_edit.png";
import unfinishedIcon from "assets/icons/icon_error_circle.png";

export const EntityCard = ({
  entity,
  formattedEntityData,
  openDrawer,
  ...props
}: Props) => {
  // any drawer-based field will do for this check
  const entityCompleted = entity.accessMeasure_population;
  return (
    <Card {...props} marginTop="2rem">
      <Box sx={sx.contentBox}>
        <Image
          src={entityCompleted ? completedIcon : unfinishedIcon}
          alt={`entity is ${entityCompleted ? "completed" : "unfinished"}`}
          sx={sx.statusIcon}
        />
        <button className="delete-entity-button">
          <Image
            src={deleteIcon}
            alt="Delete Entity"
            sx={sx.deleteButtonImage}
          />
        </button>
        <Heading as="h4" sx={sx.heading}>
          {formattedEntityData.category}
        </Heading>
        <Text sx={sx.description}>
          {formattedEntityData.standardDescription}
        </Text>
        <Text sx={sx.subtitle}>General category</Text>
        <Text sx={sx.subtext}>{formattedEntityData.standardType}</Text>
        <Button
          variant="outline"
          size="sm"
          sx={sx.editEntityButton}
          leftIcon={<Image src={editIcon} alt="edit icon" height="1rem" />}
        >
          Edit measure
        </Button>
        {entityCompleted ? (
          <>i'm done!</>
        ) : (
          <Text sx={sx.unfinishedMessage}>
            Complete the remaining indicators for this access measure by
            entering details.
          </Text>
        )}
        <Button
          size="sm"
          sx={sx.enterDrawerButton}
          onClick={() => openDrawer(entity)}
        >
          Enter details
        </Button>
      </Box>
    </Card>
  );
};

interface Props {
  entity: AnyObject;
  formattedEntityData: AnyObject;
  openDrawer: Function;
  [key: string]: any;
}

const sx = {
  root: {
    marginTop: "2rem",
  },
  contentBox: {
    marginX: "1.25rem",
    position: "relative",
    ".delete-entity-button": {
      position: "absolute",
      right: "-2rem",
      ".mobile &": {
        right: "-1.5rem",
      },
    },
  },
  statusIcon: {
    position: "absolute",
    left: "-2rem",
    height: "1rem",
    ".mobile &": {
      left: "-1.5rem",
    },
  },
  deleteButtonImage: {
    height: "1.25rem",
    _hover: {
      filter: svgFilters.primary_darker,
    },
  },
  heading: {
    fontSize: "sm",
  },
  description: {
    marginTop: "0.75rem",
    fontSize: "sm",
  },
  subtitle: {
    marginTop: "1rem",
    fontSize: "xs",
    fontWeight: "bold",
  },
  subtext: {
    marginTop: "0.25rem",
    fontSize: "sm",
  },
  editEntityButton: {
    marginY: "1rem",
    fontWeight: "normal",
  },
  unfinishedMessage: {
    marginBottom: "0.75rem",
    fontSize: "xs",
    color: "palette.error_dark",
  },
  enterDrawerButton: {
    fontWeight: "normal",
  },
};
