// components
import { Grid, GridItem, Heading, Text } from "@chakra-ui/react";
// utils
import { AnyObject, ModalDrawerEntityTypes } from "types";

export const EntityCardTopSection = ({
  entityType,
  formattedEntityData,
  printVersion,
}: Props) => {
  switch (entityType) {
    case ModalDrawerEntityTypes.ACCESS_MEASURES:
      return (
        <>
          <Heading as="h4" sx={sx.heading}>
            {printVersion && "C2.V.3 Standard type: "}
            {formattedEntityData.category}
          </Heading>
          {printVersion && (
            <Text sx={sx.subtitle}>C2.V.2 Measure standard</Text>
          )}
          <Text sx={printVersion ? sx.subtext : sx.description}>
            {formattedEntityData.standardDescription}
          </Text>
          <Text sx={sx.subtitle}>
            {printVersion && "C2.V.1 "}General category
          </Text>
          <Text sx={sx.subtext}>{formattedEntityData.standardType}</Text>
        </>
      );
    case ModalDrawerEntityTypes.SANCTIONS:
      return (
        <>
          <Heading as="h4" sx={sx.heading}>
            {printVersion && "D3.VIII.1 Intervention type: "}
            {formattedEntityData.interventionType}
          </Heading>
          <Grid sx={sx.grid}>
            <GridItem>
              <Text sx={sx.subtitle}>
                {printVersion && "D3.VIII.2 "}Intervention topic
              </Text>
              <Text sx={sx.subtext}>
                {formattedEntityData.interventionTopic}
              </Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.subtitle}>
                {printVersion && "D3.VIII.3 "}Plan name
              </Text>
              <Text sx={sx.subtext}>{formattedEntityData.planName}</Text>
            </GridItem>
          </Grid>
          <Text sx={sx.subtitle}>
            {printVersion && "D3.VIII.4 "}Reason for intervention
          </Text>
          <Text sx={sx.description}>
            {formattedEntityData.interventionReason}
          </Text>
        </>
      );
    case ModalDrawerEntityTypes.QUALITY_MEASURES:
      return (
        <>
          <Heading as="h4" sx={sx.heading}>
            {printVersion && "D2.VII.1 Measure Name: "}
            {formattedEntityData.name}
          </Heading>
          <Text sx={sx.subtitle}>
            {printVersion && "D2.VII.2 "}Measure Domain
          </Text>
          <Text sx={sx.subtext}>{formattedEntityData.domain}</Text>
          <Grid sx={sx.grid}>
            <GridItem>
              <Text sx={sx.subtitle}>
                {printVersion && "D2.VII.3 "}National Quality Forum (NQF) number
              </Text>
              <Text sx={sx.subtext}>{formattedEntityData.nqfNumber}</Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.subtitle}>
                {printVersion
                  ? "D2.VII.4 Measure Reporting and D2.VII.5 Programs"
                  : "Measure Reporting and Programs"}
              </Text>
              <Text sx={sx.subtext}>
                {formattedEntityData.reportingRateType}
              </Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.subtitle}>
                {printVersion && "D2.VII.6 "}Measure Set
              </Text>
              <Text sx={sx.subtext}>{formattedEntityData.set}</Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.subtitle}>
                {printVersion
                  ? "D2.VII.7a Reporting Period and D2.VII.7b Reporting period: Date range"
                  : "Measure Reporting Period"}
              </Text>
              <Text sx={sx.subtext}>
                {formattedEntityData.reportingPeriod === "Yes"
                  ? formattedEntityData.reportingPeriod
                  : `No, ${formattedEntityData.reportingPeriod}`}
              </Text>
            </GridItem>
          </Grid>
          <Text sx={sx.subtitle}>
            {printVersion && "D2.VII.8 "}Measure Description
          </Text>
          <Text sx={sx.subtext}>{formattedEntityData.description}</Text>
        </>
      );
    default:
      return <Text>{entityType}</Text>;
  }
};

interface Props {
  entityType: string;
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
};
