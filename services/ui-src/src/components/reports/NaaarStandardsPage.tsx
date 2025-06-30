import { useEffect } from "react";
// components
import { Box, Button, Heading, Image } from "@chakra-ui/react";
import { SortableNaaarStandardsTable } from "components";
// types
import { AnyObject, EntityType } from "types";
// utils
import { useStore } from "utils";
// assets
import addIconWhite from "assets/icons/icon_add.png";
import addIconSVG from "assets/icons/icon_add_gray.svg";

export const NaaarStandardsPage = ({
  atLeastOneRequiredAnalysisMethodUtilized,
  analysisMethodsComplete,
  openDeleteEntityModal,
  openRowDrawer,
  canAddStandards,
  setCanAddStandards,
  sxOverride,
  verbiage,
}: Props) => {
  const { report } = useStore();
  const { fieldData } = report || {};

  const standards = fieldData?.[EntityType.STANDARDS] || [];

  const numberOfStandards = standards.length;
  const providerTypeSelected = fieldData?.providerTypes?.length > 0;

  // add button disabled if analysis methods are incomplete, complete without any utilized, or no provider types are selected
  useEffect(() => {
    if (
      !analysisMethodsComplete() ||
      (analysisMethodsComplete() &&
        !atLeastOneRequiredAnalysisMethodUtilized) ||
      !providerTypeSelected
    ) {
      setCanAddStandards(false);
    } else {
      setCanAddStandards(true);
    }
  }, [atLeastOneRequiredAnalysisMethodUtilized, providerTypeSelected]);

  const dashTitle = `${verbiage.dashboardTitle}${numberOfStandards}`;

  const addStandardsButton = (
    <Button
      sx={sx.addStandardsButton}
      leftIcon={
        <Image
          sx={sxOverride.buttonIcons}
          src={canAddStandards ? addIconWhite : addIconSVG}
          alt="Add"
        />
      }
      onClick={() => openRowDrawer()}
      disabled={!canAddStandards}
    >
      {verbiage.addEntityButtonText}
    </Button>
  );

  return (
    <Box>
      {addStandardsButton}
      <Heading sx={sxOverride.dashboardTitle}>{dashTitle}</Heading>
      {numberOfStandards > 0 && (
        <Box>
          <SortableNaaarStandardsTable
            entities={standards}
            openRowDrawer={openRowDrawer}
            openDeleteEntityModal={openDeleteEntityModal}
          />
          {addStandardsButton}
        </Box>
      )}
    </Box>
  );
};

interface Props {
  atLeastOneRequiredAnalysisMethodUtilized: boolean;
  analysisMethodsComplete: Function;
  openDeleteEntityModal: Function;
  openRowDrawer: Function;
  canAddStandards: boolean;
  setCanAddStandards: Function;
  sxOverride: AnyObject;
  verbiage: AnyObject;
}

const sx = {
  addStandardsButton: {
    marginBottom: "0",
    marginTop: "2rem",
    "&:first-of-type": {
      marginBottom: "2rem",
      marginTop: "0",
    },
  },
};
