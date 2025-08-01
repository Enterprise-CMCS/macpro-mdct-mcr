import { useState, useEffect } from "react";
// components
import { Box, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
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
        <>
          <Heading as={isPDF ? "p" : "h4"} sx={sx.heading}>
            {`${printVersion ? "C2.V.3 Standard type: " : ""}${
              formattedEntityData.standardType
            }`}
          </Heading>
          {printVersion && (
            <Text sx={sx.subtitle}>C2.V.2 Measure standard</Text>
          )}
          <Text sx={printVersion ? sx.subtext : sx.description}>
            {formattedEntityData.standardDescription}
          </Text>
          <Text sx={sx.subtitle}>
            {`${printVersion ? "C2.V.1 " : ""}General category`}
          </Text>
          <Text sx={sx.subtext}>{formattedEntityData.category}</Text>
        </>
      );
    case EntityType.SANCTIONS:
      return (
        <>
          <Heading as={isPDF ? "p" : "h4"} sx={sx.heading}>
            {`${printVersion ? "D3.VIII.1 Intervention type: " : ""}${
              formattedEntityData.interventionType
            }`}
          </Heading>
          <Grid sx={sx.grid}>
            <GridItem>
              <Text sx={sx.subtitle}>
                {`${printVersion ? "D3.VIII.2 " : ""}Plan performance issue`}
              </Text>
              <Text sx={sx.subtext}>
                {formattedEntityData.interventionTopic}
              </Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.subtitle}>
                {`${printVersion ? "D3.VIII.3 " : ""}Plan name`}
              </Text>
              <Text sx={sx.subtext}>{formattedEntityData.planName}</Text>
            </GridItem>
          </Grid>
          <Text sx={sx.subtitle}>
            {`${printVersion ? "D3.VIII.4 " : ""}Reason for intervention`}
          </Text>
          <Text sx={sx.description}>
            {formattedEntityData.interventionReason}
          </Text>
        </>
      );
    case EntityType.QUALITY_MEASURES:
      return (
        <>
          <Heading as={isPDF ? "p" : "h4"} sx={sx.heading}>
            {`${printVersion ? "D2.VII.1 Measure Name: " : ""}${
              formattedEntityData.name
            }`}
          </Heading>
          <Text sx={sx.subtitle}>
            {`${printVersion ? "D2.VII.2 " : ""}Measure Domain`}
          </Text>
          <Text sx={sx.subtext}>{formattedEntityData.domain}</Text>
          <Grid sx={sx.grid}>
            <GridItem>
              <Text sx={sx.subtitle}>
                {`${
                  printVersion ? "D2.VII.3 " : ""
                }National Quality Forum (NQF) number`}
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
                {`${printVersion ? "D2.VII.6 " : ""}Measure Set`}
              </Text>
              <Text sx={sx.subtext}>{formattedEntityData.set}</Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.subtitle}>
                {printVersion
                  ? "D2.VII.7a Reporting Period and D2.VII.7b Reporting period: Date range"
                  : "Measure Reporting Period"}
              </Text>
              {formattedEntityData.reportingPeriod ? (
                <Text sx={sx.subtext}>
                  {formattedEntityData.reportingPeriod}
                </Text>
              ) : (
                <Text
                  sx={sx.unfinishedMessage}
                  className={printVersion ? "pdf-color" : ""}
                >
                  Not answered
                </Text>
              )}
            </GridItem>
          </Grid>
          <Text sx={sx.subtitle}>
            {`${printVersion ? "D2.VII.8 " : ""}Measure Description`}
          </Text>
          <Text sx={sx.subtext}>{formattedEntityData.description}</Text>
        </>
      );
    case EntityType.STANDARDS:
      return (
        <>
          <Flex>
            <Text sx={sx.standardCount}>{formattedEntityData.count}</Text>
            <Text sx={sx.standardHeading}>
              {formattedEntityData.standardType}
            </Text>
          </Flex>
          <Text sx={sx.standardDescription}>
            {formattedEntityData.description}
          </Text>
        </>
      );
    case EntityType.PLANS:
      return (
        <>
          <Text sx={sx.planHeading}>{formattedEntityData.heading}</Text>
          {formattedEntityData?.questions?.map((q: AnyObject) => {
            return (
              <Box key={`${q.question} ${q.answer}`}>
                <Text sx={sx.subtitle}>{q.question}</Text>
                <Text sx={sx.subtext}>{q.answer}</Text>
              </Box>
            );
          })}
        </>
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
    color: "palette.error_dark",
    "&.pdf-color": {
      color: "palette.error_darker",
    },
  },
  standardCount: {
    width: "44px",
    fontWeight: "bold",
    fontSize: "sm",
    color: "palette.gray_medium",
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
    borderTopColor: "palette.gray_lighter",
    fontWeight: "bold",
    fontSize: "md",
  },
};
