// components
import { Text } from "@chakra-ui/react";
import { AccessMeasuresSection } from "./AccessMeasuresSection";
import { QualityMeasuresSection } from "./QualityMeasuresSection";
import { SanctionsSection } from "./SanctionsSection";
import { StandardsSection } from "./StandardsSection";
// types
import { AnyObject, EntityType } from "types";

export const EntityCardBottomSection = ({
  entityType,
  formattedEntityData,
  printVersion,
}: Props) => {
  const notAnswered = (
    <Text as="span" sx={sx.notAnswered}>
      Not answered
    </Text>
  );

  switch (entityType) {
    case EntityType.ACCESS_MEASURES:
      return (
        <AccessMeasuresSection
          formattedEntityData={formattedEntityData}
          printVersion={printVersion}
          notAnswered={notAnswered}
          sx={sx}
          bottomSection
        />
      );
    case EntityType.SANCTIONS:
      return (
        <SanctionsSection
          formattedEntityData={formattedEntityData}
          printVersion={!!printVersion}
          notAnswered={notAnswered}
          sx={sx}
          bottomSection
        />
      );
    case EntityType.QUALITY_MEASURES:
      return <QualityMeasuresSection bottomSection />;
    case EntityType.STANDARDS:
      return (
        <StandardsSection
          formattedEntityData={formattedEntityData}
          sx={sx}
          bottomSection
        />
      );
    default:
      return <Text>{entityType}</Text>;
  }
};

interface Props {
  entityType: EntityType;
  formattedEntityData: AnyObject;
  printVersion?: boolean;
  verbiage?: {
    entityMissingResponseMessage?: string;
    entityEmptyResponseMessage?: string;
  };
}

const sx = {
  subtitle: {
    marginTop: "spacer2",
    fontSize: "xs",
    fontWeight: "bold",
  },
  subtext: {
    marginTop: "spacer_half",
    fontSize: "sm",
  },
  resultsHeader: {
    marginY: "spacer2",
    fontSize: "xs",
    fontWeight: "bold",
  },
  missingResponseMessage: {
    marginBottom: "spacer2",
    fontSize: "xs",
    color: "error_dark",
  },
  highlightContainer: {
    marginTop: "spacer2",
    marginBottom: "spacer2",
    padding: "0 1.5rem 1rem",
    background: "secondary_lightest",
    borderRadius: "3px",
    "&.error": {
      background: "error_lightest",
    },
    "&:last-of-type": {
      marginBottom: 0,
    },
  },
  highlightSection: {
    width: "100%",
    marginLeft: "spacer2",
    ":nth-of-type(1)": {
      marginLeft: 0,
    },
  },
  notAnswered: {
    fontSize: "sm",
    color: "error_darker",
  },
  standardDetailsBoxes: {
    width: "10.5rem",
    marginRight: "spacer6",
  },
};
