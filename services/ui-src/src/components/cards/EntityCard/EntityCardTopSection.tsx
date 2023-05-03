// components
import { Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
// utils
import { AnyObject, ModalDrawerEntityTypes, ViewType } from "types";

export const EntityCardTopSection = ({
  entityType,
  formattedEntityData,
  viewType,
}: Props) => {
  const containerStyle =
    viewType == ViewType.MODAL_DRAWER ? sx.detailBox : sx.entityBox;
  const headingStyle =
    viewType === ViewType.MODAL_DRAWER ? sx.detailHeader : sx.heading;
  const subtitleStyle =
    viewType === ViewType.MODAL_DRAWER ? sx.detailSubtitle : sx.subtitle;
  const subtextStyle =
    viewType === ViewType.MODAL_DRAWER ? sx.detailSubtext : sx.subtext;

  switch (entityType) {
    case ModalDrawerEntityTypes.ACCESS_MEASURES:
      var category,
        descriptionHeading,
        standardDescriptionStyle,
        standardTypeHeading,
        standardType;
      if (viewType === ViewType.ENTITY) {
        category = formattedEntityData.category;
        standardDescriptionStyle = sx.description;
        standardTypeHeading = "Standard type";
        standardType = formattedEntityData.standardType;
      } else if (viewType === ViewType.MODAL_DRAWER) {
        category = `Standard Type - ${formattedEntityData.category}`;
        standardDescriptionStyle = sx.detailDescription;
        standardTypeHeading = "General Category";
        standardType = formattedEntityData.category;
      } else if (viewType === ViewType.PRINT) {
        category = `C2.V.1 General category:  ${formattedEntityData.category}`;
        descriptionHeading = "C2.V.2 Measure standard";
        standardDescriptionStyle = subtextStyle;
        standardTypeHeading = "C2.V.3 Standard type";
        standardType = formattedEntityData.standardType;
      }
      return (
        <Box sx={containerStyle}>
          <Heading as="h4" sx={headingStyle}>
            {category}
          </Heading>
          {viewType === ViewType.PRINT && (
            <Text sx={subtitleStyle}>{descriptionHeading}</Text>
          )}
          <Text sx={standardDescriptionStyle}>
            {formattedEntityData.standardDescription}
          </Text>
          <Text sx={subtitleStyle}>{standardTypeHeading}</Text>
          <Text sx={subtextStyle}>{standardType}</Text>
        </Box>
      );
    case ModalDrawerEntityTypes.SANCTIONS:
      var heading,
        interventionTopicHeading,
        planHeading,
        interventionReasonHeading;
      if (viewType === ViewType.ENTITY) {
        heading = formattedEntityData.interventionType;
        interventionTopicHeading = "Intervention topic";
        planHeading = "Plan name";
        interventionReasonHeading = "Reason for intervention";
      } else if (viewType === ViewType.MODAL_DRAWER) {
        heading = `Intervention type - ${formattedEntityData.interventionType}`;
        interventionTopicHeading = "Intervention topic";
        planHeading = "Plan name";
        interventionReasonHeading = "Reason for intervention";
      } else if (viewType === ViewType.PRINT) {
        heading = `D3.VIII.1 Intervention type: ${formattedEntityData.interventionType}`;
        interventionTopicHeading = "D3.VIII.2 Intervention topic";
        planHeading = "D3.VIII.3 Plan name";
        interventionReasonHeading = "D3.VIII.4 Reason for intervention";
      }
      return (
        <Box sx={containerStyle}>
          <Heading as="h4" sx={headingStyle}>
            {heading}
          </Heading>
          <Grid sx={sx.grid}>
            <GridItem>
              <Text sx={subtitleStyle}>{interventionTopicHeading}</Text>
              <Text sx={subtextStyle}>
                {formattedEntityData.interventionTopic}
              </Text>
            </GridItem>
            <GridItem>
              <Text sx={subtitleStyle}>{planHeading}</Text>
              <Text sx={subtextStyle}>{formattedEntityData.planName}</Text>
            </GridItem>
          </Grid>
          <Text sx={subtitleStyle}>{interventionReasonHeading}</Text>
          <Text sx={subtextStyle}>
            {formattedEntityData.interventionReason}
          </Text>
        </Box>
      );
    case ModalDrawerEntityTypes.QUALITY_MEASURES:
      var name,
        domainHeading,
        nqfHeading,
        reportingRateHeading,
        setHeading,
        reportingPeriodHeading,
        descHeading;
      if (viewType === ViewType.ENTITY) {
        name = formattedEntityData.name;
        domainHeading = "Measure Domain";
        nqfHeading = "National Quality Forum (NQF) number";
        reportingRateHeading = "Measure Reporting and Programs";
        setHeading = "Measure Set:";
        reportingPeriodHeading = "Measure Reporting Period";
        descHeading = "Measure Description";
      } else if (viewType === ViewType.MODAL_DRAWER) {
        name = formattedEntityData.name;
        domainHeading = "Measure Domain";
        nqfHeading = "NQF";
        reportingRateHeading = "Measure Reporting and Programs";
        setHeading = "Measure Set";
        reportingPeriodHeading = "Measure Reporting Period";
        descHeading = "Measure Description";
      } else if (viewType === ViewType.PRINT) {
        name = `D2.VII.1 Measure Name: ${formattedEntityData.name}`;
        domainHeading = "D2.VII.2 Measure Domain";
        nqfHeading = "D2.VII.3 National Quality Forum (NQF) number";
        reportingRateHeading =
          "D2.VII.4 Measure Reporting and D2.VII.5 Programs";
        setHeading = "D2.VII.6 Measure Set:";
        reportingPeriodHeading =
          "D2.VII.7a Reporting Period and D2.VII.7b Reporting period: Date range";
        descHeading = "D2.VII.8 Measure Description";
      }
      return (
        <Box sx={containerStyle}>
          {viewType === ViewType.MODAL_DRAWER ? (
            <Text sx={sx.detailHeader}>{name}</Text>
          ) : (
            <Heading as="h4" sx={sx.heading}>
              {name}
            </Heading>
          )}
          <Text sx={subtitleStyle}>{domainHeading}</Text>
          <Text sx={subtextStyle}>{formattedEntityData.domain}</Text>
          <Grid sx={sx.grid}>
            <GridItem>
              <Text sx={subtitleStyle}>{nqfHeading}</Text>
              <Text sx={subtextStyle}>{formattedEntityData.nqfNumber}</Text>
            </GridItem>
            <GridItem>
              <Text sx={subtitleStyle}>{reportingRateHeading}</Text>
              <Text sx={subtextStyle}>
                {formattedEntityData.reportingRateType}
              </Text>
            </GridItem>
            <GridItem>
              <Text sx={subtitleStyle}>{setHeading}</Text>
              <Text sx={subtextStyle}>{formattedEntityData.set}</Text>
            </GridItem>
            <GridItem>
              <Text sx={subtitleStyle}>{reportingPeriodHeading}</Text>
              <Text sx={subtextStyle}>
                {formattedEntityData.reportingPeriod}
              </Text>
            </GridItem>
          </Grid>
          <Text sx={subtitleStyle}>{descHeading}</Text>
          <Text sx={subtextStyle}>{formattedEntityData.description}</Text>
        </Box>
      );
    default:
      return <Text>{entityType}</Text>;
  }
};

interface Props {
  entityType: string;
  formattedEntityData: AnyObject;
  viewType: ViewType;
}

const sx = {
  entityBox: {
    fontWeight: "normal",
    color: "palette.base",
  },
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
  detailBox: {
    marginTop: "2rem",
    fontWeight: "normal",
    color: "palette.base",
  },
  detailHeader: {
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  detailDescription: {
    marginBottom: ".5rem",
    fontSize: "md",
  },
  detailSubtitle: {
    marginTop: "1rem",
    fontSize: "xs",
    fontWeight: "bold",
  },
  detailSubtext: {
    marginTop: "0.25rem",
    fontSize: "sm",
  },
};
