// components
import { Box, Button, Image, Heading, Text, Flex } from "@chakra-ui/react";
import { BasicPage, IntroSection, SpreadsheetWidget } from "components";
import { useNavigate } from "react-router-dom";
// utils
import { makeMediaQueryClasses } from "utils";
import verbiage from "verbiage/pages/mcpar/mcpar-intro";
// assets
import nextIcon from "assets/icons/icon_next.png";
import NavigationSectionsImage from "../../assets/images/NavigationSections_2x.png";
import NavigationSectionsSubmissionImage from "../../assets/images/NavigationSectionsSubmission_2x.png";

export const Intro = () => {
  const { intro, body, pageLink } = verbiage;
  const mqClasses = makeMediaQueryClasses();
  const navigate = useNavigate();

  const [section1, section2, section3] = body.sections;

  return (
    <BasicPage sx={sx.layout} data-testid="intro-view">
      <Box sx={sx.leadTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          {intro.header}
        </Heading>
      </Box>
      <div>
        <IntroSection content={section1}>
          <Flex sx={sx.sectionContent} className={mqClasses}>
            <Box sx={sx.widgetContainer}>
              <Text sx={sx.widgetTitle}>{section1.widget?.title}</Text>
              <Box>
                {section1.widget?.descriptionList.map((description, index) => (
                  <Text key={index}>{description}</Text>
                ))}
              </Box>
            </Box>
          </Flex>
        </IntroSection>
        <IntroSection content={section2}>
          <Flex sx={sx.sectionContent} className={mqClasses}>
            <Box>
              <Image
                src={NavigationSectionsImage}
                alt={section2.img?.alt}
                sx={sx.image}
              />
              <Text sx={sx.additionalInfo}>{section2.img?.description}</Text>
            </Box>
            <SpreadsheetWidget content={section2.spreadsheetWidget!} />
          </Flex>
        </IntroSection>
        <IntroSection content={section3}>
          <Flex sx={sx.sectionContent} className={mqClasses}>
            <Box>
              <Image
                src={NavigationSectionsSubmissionImage}
                alt={section3.img?.alt}
                sx={sx.image}
              />
            </Box>
          </Flex>
        </IntroSection>
      </div>
      <Box sx={sx.pageLinkContainer}>
        <Button
          className={mqClasses}
          sx={sx.pageLink}
          onClick={() => navigate(pageLink.route)}
          rightIcon={<Image src={nextIcon} alt="Link Icon" height="1rem" />}
        >
          {pageLink.text}
        </Button>
      </Box>
    </BasicPage>
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
    fontSize: "xl",
    fontWeight: "normal",
  },
  sectionContent: {
    marginTop: "1rem",
    gridGap: "2rem",
    flexDirection: "column",
    "&.desktop": {
      flexDirection: "row",
    },
  },
  widgetContainer: {
    marginTop: "1rem",
    paddingLeft: "1rem",
    borderLeft: ".3rem solid",
    borderColor: "palette.main",
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
    textAlign: "right",
    marginBottom: "2rem",
  },
  pageLink: {
    justifyContent: "start",
    marginTop: "1rem",
    borderRadius: "0.25rem",
    background: "palette.main",
    fontWeight: "bold",
    color: "palette.white",
    span: {
      marginLeft: "0.5rem",
      marginRight: "-0.25rem",
    },
    _hover: {
      background: "palette.main_darker",
    },
    "&.mobile": {
      fontSize: "sm",
    },
  },
};
