import { Link as RouterLink, useNavigate } from "react-router";
// components
import {
  Box,
  Button,
  Link,
  Image,
  Heading,
  Text,
  Flex,
} from "@chakra-ui/react";
import {
  Table,
  InfoSection,
  PageTemplate,
  SpreadsheetWidget,
} from "components";
// verbiage
import mcparGetStartedVerbiage from "verbiage/pages/mcpar/mcpar-get-started";
// assets
import arrowLeftIcon from "assets/icons/icon_arrow_left_blue.png";
import nextIcon from "assets/icons/icon_next_white.png";
import NavigationSectionsImage from "assets/other/nav_sections.png";
import NavigationSectionsSubmissionImage from "assets/other/nav_sections_review_submit.png";

export const ReportGetStartedPage = ({ reportType }: Props) => {
  const navigate = useNavigate();

  const { intro, body, pageLink } = mcparGetStartedVerbiage;

  const [section1, section2, section3] = body.sections;

  return (
    <Box>
      <Link as={RouterLink} to="/" sx={sx.returnLink}>
        <Image src={arrowLeftIcon} alt="Arrow left" className="returnIcon" />
        Return Home
      </Link>
      <PageTemplate sx={sx.layout}>
        <Box sx={sx.leadTextBox}>
          <Heading as="h1" sx={sx.headerText}>
            {intro.header}
          </Heading>
        </Box>
        <div>
          <InfoSection content={section1}>
            <Flex sx={sx.sectionContent}>
              <Box sx={sx.widgetContainer}>
                <Text sx={sx.widgetTitle}>{section1.widget?.title}</Text>
                <Box>
                  {section1.widget?.descriptionList.map(
                    (description: string, index: number) => (
                      <Text key={index}>{description}</Text>
                    )
                  )}
                </Box>
              </Box>
            </Flex>
          </InfoSection>
          <InfoSection content={section2}>
            <Flex sx={sx.sectionContent}>
              <Box w="100%">
                <Image
                  src={NavigationSectionsImage}
                  alt={section2.img?.alt}
                  sx={sx.image}
                />
                <Text sx={sx.additionalInfo}>{section2.img?.description}</Text>
              </Box>
              <Box>
                <SpreadsheetWidget
                  description={section2.spreadsheet!}
                  reportType={reportType}
                />
                <Text sx={sx.additionalInfo}>{section2.additionalInfo}</Text>
              </Box>
            </Flex>
            {section2.table && (
              <Flex sx={sx.sectionContent}>
                <Box>
                  <Heading sx={sx.smallSectionHeading} size={"sm"}>
                    {section2.tableHeading}
                  </Heading>
                  <Table
                    border={true}
                    sxOverride={sx.tableHeader}
                    content={section2.table}
                  ></Table>
                </Box>
              </Flex>
            )}
            {section2.autosaveNotice && section2.autosaveHeading && (
              <Flex sx={sx.sectionContent}>
                <Box>
                  <Heading sx={sx.smallSectionHeading} size={"sm"}>
                    {section2.autosaveHeading}
                  </Heading>
                  <Text>{section2.autosaveNotice}</Text>
                </Box>
              </Flex>
            )}
          </InfoSection>
          <InfoSection content={section3}>
            <Flex sx={sx.sectionContent}>
              <Box>
                <Image
                  src={NavigationSectionsSubmissionImage}
                  alt={section3.img?.alt}
                  sx={sx.image}
                />
              </Box>
            </Flex>
          </InfoSection>
        </div>
        <Box sx={sx.pageLinkContainer}>
          <Button
            sx={sx.pageLink}
            onClick={() => navigate(pageLink.route)}
            rightIcon={<Image src={nextIcon} alt="Link Icon" height="1rem" />}
          >
            {pageLink.text}
          </Button>
        </Box>
      </PageTemplate>
    </Box>
  );
};

interface Props {
  reportType: string;
}

const sx = {
  layout: {
    ".contentFlex": {
      marginTop: "3.5rem",
    },
  },
  returnLink: {
    display: "flex",
    width: "8.5rem",
    marginTop: "spacer3",
    svg: {
      height: "1.375rem",
      width: "1.375rem",
      marginTop: "-0.125rem",
      marginRight: ".5rem",
    },
    textDecoration: "none",
    _hover: {
      textDecoration: "underline",
    },
    ".returnIcon": {
      width: "1.25rem",
      height: "1.25rem",
      marginTop: "spacer_half",
      marginRight: "spacer1",
    },
  },
  leadTextBox: {
    width: "100%",
    marginBottom: "2.25rem",
  },
  headerText: {
    marginBottom: "spacer2",
    fontSize: "4xl",
    fontWeight: "normal",
  },
  sectionContent: {
    marginTop: "spacer2",
    marginBottom: "spacer4",
    gridGap: "spacer4",
    flexDirection: "column",
    ".desktop &": {
      flexDirection: "row",
    },
  },
  widgetContainer: {
    marginTop: "spacer2",
    paddingLeft: "spacer2",
    borderLeft: ".3rem solid",
    borderColor: "primary",
  },
  widgetTitle: {
    fontWeight: "bold",
  },
  image: {
    maxWidth: "20rem",
    width: "100%",
  },
  additionalInfo: {
    marginTop: "spacer2",
    fontSize: "sm",
  },
  pageLinkContainer: {
    marginTop: "spacer2",
    marginBottom: "spacer4",
    textAlign: "right",
  },
  pageLink: {
    justifyContent: "start",
    marginBottom: "spacer2",
    borderRadius: "0.25rem",
    span: {
      marginLeft: "spacer1",
      marginRight: "-0.25rem",
    },
  },
  smallSectionHeading: {
    marginBottom: "spacer2",
  },
  tableHeader: {
    Th: {
      color: "gray",
    },
  },
};
