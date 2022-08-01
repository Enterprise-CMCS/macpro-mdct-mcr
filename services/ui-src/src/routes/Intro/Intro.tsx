// components
import { Box, Button, Image, Heading } from "@chakra-ui/react";
import { BasicPage, Section } from "components";
import { useNavigate } from "react-router-dom";
// utils
import { makeMediaQueryClasses } from "utils";
import verbiage from "verbiage/pages/mcpar/mcpar-intro";
// assets
import nextIcon from "assets/icons/icon_next.png";

export const Intro = () => {
  const { intro, body, pageLink } = verbiage;
  const mqClasses = makeMediaQueryClasses();
  const navigate = useNavigate();

  return (
    <BasicPage sx={sx.layout} data-testid="intro-view">
      <Box sx={sx.leadTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          {intro.header}
        </Heading>
      </Box>
      <div>
        {body.sections.map((section, index) => (
          <Section
            index={index + 1}
            content={section}
            key={`section-${index}`}
          />
        ))}
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
    fontSize: "2rem",
    fontWeight: "normal",
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
