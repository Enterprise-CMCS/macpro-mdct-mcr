import { useState, useEffect } from "react";
// components
import { Text } from "@chakra-ui/react";
import { AccessMeasuresSection } from "./AccessMeasuresSection";
import { SanctionsSection } from "./SanctionsSection";
import { QualityMeasuresSection } from "./QualityMeasuresSection";
import { StandardsSection } from "./StandardsSection";
import { PlansSection } from "./PlansSection";
// types
import { AnyObject, EntityType } from "types";

export const EntityCardTopSection = ({
  entityType,
  formattedEntityData,
  printVersion,
}: Props) => {
  const [isPDF, setIsPDF] = useState(false);

  useEffect(() => {
    if (window.location.pathname === "/mcpar/export") {
      setIsPDF(true);
    }
  }, []);

  switch (entityType) {
    case EntityType.ACCESS_MEASURES:
      return (
        <AccessMeasuresSection
          formattedEntityData={formattedEntityData}
          printVersion={printVersion}
          sx={sx}
          isPDF={isPDF}
          topSection
        />
      );
    case EntityType.SANCTIONS:
      return (
        <SanctionsSection
          formattedEntityData={formattedEntityData}
          printVersion={!!printVersion}
          sx={sx}
          isPDF={isPDF}
          topSection
        />
      );
    case EntityType.QUALITY_MEASURES:
      return (
        <QualityMeasuresSection
          formattedEntityData={formattedEntityData}
          printVersion={!!printVersion}
          sx={sx}
          isPDF={isPDF}
          topSection
        />
      );
    case EntityType.STANDARDS:
      return (
        <StandardsSection
          formattedEntityData={formattedEntityData}
          sx={sx}
          topSection
        />
      );
    case EntityType.PLANS:
      return (
        <PlansSection
          formattedEntityData={formattedEntityData}
          sx={sx}
          topSection
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
}

const sx = {
  heading: {
    fontSize: "sm",
  },
  description: {
    marginTop: "0.75rem",
    fontSize: "sm",
  },
  grid: {
    gridTemplateColumns: "33% auto",
    columnGap: "1rem",
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
  unfinishedMessage: {
    fontSize: "xs",
    color: "error_dark",
    "&.pdf-color": {
      color: "error_darker",
    },
  },
  standardCount: {
    width: "44px",
    fontWeight: "bold",
    fontSize: "sm",
    color: "gray",
  },
  standardHeading: {
    fontWeight: "bold",
    fontSize: "md",
  },
  standardDescription: {
    marginTop: "1rem",
  },
  planHeading: {
    marginTop: "1rem",
    paddingTop: "1rem",
    borderTop: "1px solid",
    borderTopColor: "gray_lighter",
    fontWeight: "bold",
    fontSize: "md",
  },
};
