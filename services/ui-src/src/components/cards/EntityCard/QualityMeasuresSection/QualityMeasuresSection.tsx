import { ReactNode } from "react";
import { AnyObject, SxObject } from "types";
import {
  BottomQualityMeasuresSectionV1,
  TopQualityMeasuresSectionV1,
} from "./QualityMeasuresSectionsV1";
import {
  BottomQualityMeasuresSectionV2,
  TopQualityMeasuresSectionV2,
} from "./QualityMeasuresSectionsV2";

// Helper to detect which template version the data uses based on data storage structure
const detectTemplateVersion = (data: FormattedEntityData): "V1" | "V2" => {
  // Legacy template stores plan-level data in perPlanResponses array
  if (data.perPlanResponses !== undefined) {
    return "V1";
  }
  // New template stores plan-level data in measureResults array
  if (data.measureResults !== undefined) {
    return "V2";
  }
  // Default to new if ambiguous (for future reports)
  return "V2";
};

export const QualityMeasuresSection = ({
  formattedEntityData,
  printVersion,
  notAnswered,
  verbiage,
  sx,
  isPDF,
  topSection,
  bottomSection,
}: Props) => {
  // Detect which template version to use based on data structure
  const templateVersion = detectTemplateVersion(formattedEntityData);

  const topQualityMeasureSections = {
    V1: TopQualityMeasuresSectionV1,
    V2: TopQualityMeasuresSectionV2,
  };

  const bottomQualityMeasureSections = {
    V1: BottomQualityMeasuresSectionV1,
    V2: BottomQualityMeasuresSectionV2,
  };

  const TopQualityMeasuresSection = ({
    formattedEntityData,
    printVersion,
    isPDF,
    sx,
  }: TopProps) => {
    const TopSection = topQualityMeasureSections[templateVersion];
    return (
      <TopSection
        formattedEntityData={formattedEntityData}
        printVersion={printVersion}
        isPDF={isPDF}
        sx={sx}
      />
    );
  };

  const BottomQualityMeasuresSection = ({
    formattedEntityData,
    printVersion,
    notAnswered,
    verbiage,
    sx,
  }: BottomProps) => {
    const BottomSection = bottomQualityMeasureSections[templateVersion];
    return (
      <BottomSection
        formattedEntityData={formattedEntityData}
        printVersion={printVersion}
        notAnswered={notAnswered}
        verbiage={verbiage}
        sx={sx}
      />
    );
  };

  return (
    <>
      {topSection && (
        <TopQualityMeasuresSection
          formattedEntityData={formattedEntityData}
          printVersion={printVersion}
          isPDF={isPDF}
          sx={sx}
        />
      )}
      {bottomSection && (
        <BottomQualityMeasuresSection
          formattedEntityData={formattedEntityData}
          printVersion={printVersion}
          isPDF={isPDF}
          notAnswered={notAnswered}
          verbiage={verbiage}
          sx={sx}
        />
      )}
    </>
  );
};

export interface FormattedEntityData {
  isPartiallyComplete?: boolean;
  perPlanResponses?: {
    name: string;
    response: string;
  }[];
  set?: string;
  name?: string;
  domain?: string;
  description?: string;
  nqfNumber?: string;
  reportingRateType?: string;
  reportingPeriod?: string;
  // New template fields
  cmitNumber?: string;
  cbeNumber?: string;
  identifierUrl?: string;
  identifierDomain?: string;
  dataVersion?: string;
  activities?: string;
  measureResults?: AnyObject[];
}

interface BaseProps {
  formattedEntityData: FormattedEntityData;
  printVersion: boolean;
  sx: SxObject;
}

interface TopProps extends BaseProps {
  isPDF?: boolean;
}

interface BottomProps extends BaseProps {
  isPDF?: boolean;
  notAnswered?: ReactNode;
  verbiage?: {
    entityMissingResponseMessage?: string;
    entityEmptyResponseMessage?: string;
  };
}

interface Props extends TopProps, BottomProps {
  topSection?: boolean;
  bottomSection?: boolean;
}
