// components
import { Box, Button, Image, Heading, Text, Flex } from "@chakra-ui/react";
import { InfoSection, PageTemplate, SpreadsheetWidget } from "components";
import { useNavigate } from "react-router-dom";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-get-started";
// assets
import nextIcon from "assets/icons/icon_next.png";
import NavigationSectionsImage from "assets/other/nav-sections.png";
import NavigationSectionsSubmissionImage from "assets/other/nav-sections-review-submit.png";

export const GetStartedPage = () => {
  const { intro, body, pageLink } = verbiage;
  const navigate = useNavigate();

  const [section1, section2, section3] = body.sections;

  return (
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
                {section1.widget?.descriptionList.map((description, index) => (
                  <Text key={index}>{description}</Text>
                ))}
              </Box>
            </Box>
          </Flex>
        </InfoSection>
        <InfoSection content={section2}>
          <Flex sx={sx.sectionContent}>
            <Box>
              <Image
                src={NavigationSectionsImage}
                alt={section2.img?.alt}
                sx={sx.image}
              />
              <Text sx={sx.additionalInfo}>{section2.img?.description}</Text>
            </Box>
            <Box>
              <SpreadsheetWidget description={section2.spreadsheet!} />
              <Text sx={sx.additionalInfo}>{section2.additionalInfo}</Text>
            </Box>
          </Flex>
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
  );
};

const sx = {
  layout: {
    ".contentFlex": {
      marginTop: "3.5rem",
    },
  },
  leadTextBox: {
    width: "100%",
    marginBottom: "2.25rem",
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "4xl",
    fontWeight: "normal",
  },
  sectionContent: {
    marginTop: "1rem",
    gridGap: "2rem",
    flexDirection: "column",
    ".desktop &": {
      flexDirection: "row",
    },
  },
  widgetContainer: {
    marginTop: "1rem",
    paddingLeft: "1rem",
    borderLeft: ".3rem solid",
    borderColor: "palette.primary",
  },
  widgetTitle: {
    fontWeight: "bold",
  },
  image: {
    maxWidth: "20rem",
  },
  additionalInfo: {
    marginTop: "1rem",
    fontSize: "sm",
  },
  pageLinkContainer: {
    marginTop: "1rem",
    marginBottom: "2rem",
    textAlign: "right",
  },
  pageLink: {
    justifyContent: "start",
    marginBottom: "1rem",
    borderRadius: "0.25rem",
    span: {
      marginLeft: "0.5rem",
      marginRight: "-0.25rem",
    },
  },
};
