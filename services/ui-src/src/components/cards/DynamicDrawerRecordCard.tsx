// components
import { Card } from "components";
import { Box, Button, Heading, Image, Text } from "@chakra-ui/react";
// utils
import { AnyObject } from "types";
import { makeMediaQueryClasses } from "utils";
// assets
import { svgFilters } from "styles/theme";
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
import editIcon from "assets/icons/icon_edit.png";
import unfinishedIcon from "assets/icons/icon_error_circle.png";

export const DynamicDrawerRecordCard = ({ record, ...props }: Props) => {
  const mqClasses = makeMediaQueryClasses();

  // data to fill in card
  const data = {
    category: record.accessMeasure_generalCategory[0].value,
    standardDescription: record.accessMeasure_standardDescription,
    standardType:
      record.accessMeasure_standardType[0].value !== "Other, specify"
        ? record.accessMeasure_standardType[0].value
        : record["accessMeasure_standardType-otherText"],
  };

  return (
    <Card {...props} className={mqClasses} marginTop="2rem">
      <Box sx={sx.contentBox}>
        <Image
          src={unfinishedIcon}
          alt="record is unfinished"
          sx={sx.statusIcon}
        />
        <button className="delete-record-button">
          <Image
            src={deleteIcon}
            alt="Delete Record"
            sx={sx.deleteButtonImage}
          />
        </button>
        <Heading as="h5" sx={sx.heading}>
          {data.category}
        </Heading>
        <Text sx={sx.description}>{data.standardDescription}</Text>
        <Text sx={sx.subtitle}>General category</Text>
        <Text sx={sx.subtext}>{data.standardType}</Text>
        <Button
          variant="outline"
          size="sm"
          sx={sx.editRecordButton}
          leftIcon={<Image src={editIcon} alt="edit icon" height="1rem" />}
        >
          Edit measure
        </Button>
        <Text sx={sx.unfinishedMessage}>
          Complete the remaining indicators for this access measure by entering
          details.
        </Text>
        <Button size="sm" sx={sx.enterDrawerButton}>
          Enter details
        </Button>
      </Box>
    </Card>
  );
};

interface Props {
  record: AnyObject;
  [key: string]: any;
}

const sx = {
  root: {
    marginTop: "2rem",
  },
  contentBox: {
    marginX: "1.25rem",
    position: "relative",
    ".delete-record-button": {
      position: "absolute",
      right: "-2rem",
    },
  },
  statusIcon: {
    position: "absolute",
    left: "-2rem",
    height: "1rem",
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
  editRecordButton: {
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
