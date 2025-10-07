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
  verbiage,
}: Props) => {
  const notAnswered = (
    <Text as="span" sx={sx.notAnswered}>
      Not answered
    </Text>
  );

  const providerText = () => {
    const provider = formattedEntityData?.provider;
    const details = formattedEntityData?.providerDetails;
    if (provider) {
      if (details) {
        return `${provider}: ${details}`;
      }
      return provider;
    }
    return printVersion && notAnswered;
  };

  switch (entityType) {
    case EntityType.ACCESS_MEASURES:
      return (
        <AccessMeasuresSection
          formattedEntityData={formattedEntityData}
          printVersion={printVersion}
          notAnswered={notAnswered}
          providerText={providerText}
          sx={sx}
        />
      );
    case EntityType.SANCTIONS:
      return (
        <SanctionsSection
          formattedEntityData={formattedEntityData}
          printVersion={!!printVersion}
          notAnswered={notAnswered}
          sx={sx}
        />
      );
    case EntityType.QUALITY_MEASURES:
      return (
        <QualityMeasuresSection
          formattedEntityData={formattedEntityData}
          printVersion={!!printVersion}
          notAnswered={notAnswered}
          verbiage={verbiage}
          sx={sx}
        />
      );
    case EntityType.STANDARDS:
      return (
        <StandardsSection formattedEntityData={formattedEntityData} sx={sx} />
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
    marginTop: "1rem",
    fontSize: "xs",
    fontWeight: "bold",
  },
  subtext: {
    marginTop: "0.25rem",
    fontSize: "sm",
  },
  resultsHeader: {
    marginY: "1rem",
    fontSize: "xs",
    fontWeight: "bold",
  },
  missingResponseMessage: {
    marginBottom: "1rem",
    fontSize: "xs",
    color: "error_dark",
  },
  highlightContainer: {
    marginTop: "1rem",
    marginBottom: "1rem",
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
    marginLeft: "1rem",
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
    marginRight: "3rem",
  },
};
