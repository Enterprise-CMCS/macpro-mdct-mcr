import { useContext } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import {
  Form,
  Icon,
  ReportContext,
  ReportDrawer,
  ReportPage,
  Sidebar,
  SpreadsheetWidget,
} from "components";
// utils
import { findRoute, hydrateFormFields, parseCustomHtml, useUser } from "utils";
import {
  AnyObject,
  CustomHtmlElement,
  ReportStatus,
  SpreadsheetWidgetProps,
  UserRoles,
} from "types";
// form data
import { mcparRoutes } from "forms/mcpar";
import { reportSchema } from "forms/mcpar/reportSchema";

export const McparReportPage = ({ pageJson }: Props) => {
  const navigate = useNavigate();
  const { reportData, updateReportData, updateReport } =
    useContext(ReportContext);
  const { path, pageType, intro, form, drawerDashboard } = pageJson;
  const { isOpen, onClose, onOpen } = useDisclosure();

  // make routes
  const previousRoute = findRoute(mcparRoutes, path, "previous", "/mcpar");
  const nextRoute = findRoute(mcparRoutes, path, "next", "/mcpar");

  // get user's state
  const { user } = useUser();
  const { state, userRole } = user ?? {};

  // TODO: get real program name per report
  const programName = "tempName";

  const onSubmit = async (formData: any) => {
    if (userRole === UserRoles.STATE_USER || userRole === UserRoles.STATE_REP) {
      const reportDetails = {
        state: state,
        reportId: programName,
      };
      const reportStatus = ReportStatus.IN_PROGRESS;
      updateReportData(reportDetails, formData);
      updateReport(reportDetails, reportStatus);
    }
    navigate(nextRoute);
  };

  const openRowDrawer = () => {
    onOpen();
  };

  if (reportData) {
    form.fields = hydrateFormFields(form.fields, reportData);
  }

  const tempEntityMap = {
    plans: ["United Healthcare", "Care 1st", "Aetna Family Care"],
  };

  return (
    <ReportPage data-testid={form.id}>
      <Flex sx={sx.pageContainer}>
        <Sidebar />
        <Flex sx={sx.reportContainer}>
          <ReportPageIntro text={intro} />
          {pageType === "drawer" ? (
            <>
              <Box>
                <Heading as="h3">{drawerDashboard.title}</Heading>
                {tempEntityMap.plans.map((entity) => {
                  return (
                    <Flex key={entity} sx={sx.entityRow}>
                      <Heading as="h4">{entity}</Heading>
                      <Button
                        sx={sx.enterButton}
                        onClick={() => openRowDrawer()}
                        variant="outline"
                      >
                        Enter
                      </Button>
                    </Flex>
                  );
                })}
              </Box>
              <ReportDrawer
                drawerDisclosure={{
                  isOpen,
                  onClose,
                }}
                drawerTitle={drawerDashboard.title}
                form={form}
                onSubmit={onSubmit}
              />
              <ReportPageFooter
                formId={form.id}
                previousRoute={previousRoute}
              />
            </>
          ) : (
            <>
              <Form
                id={form.id}
                formJson={form}
                formSchema={reportSchema[form.id as keyof typeof reportSchema]}
                onSubmit={onSubmit}
              />
              <ReportPageFooter
                formId={form.id}
                previousRoute={previousRoute}
              />
            </>
          )}
        </Flex>
      </Flex>
    </ReportPage>
  );
};

interface Props {
  pageJson: AnyObject;
}

const ReportPageIntro = ({ text }: ReportPageIntroI) => {
  const { section, subsection, info, spreadsheet } = text;
  return (
    <Box sx={sx.introBox}>
      <Heading as="h1" sx={sx.sectionHeading}>
        {section}
      </Heading>
      <Heading as="h2" sx={sx.subsectionHeading}>
        {subsection}
      </Heading>
      {spreadsheet && (
        <Box sx={sx.spreadsheetWidgetBox}>
          <SpreadsheetWidget content={spreadsheet} />
        </Box>
      )}
      {info && <Box sx={sx.infoTextBox}>{parseCustomHtml(info)}</Box>}
    </Box>
  );
};

interface ReportPageIntroI {
  text: {
    section: string;
    subsection: string;
    info?: CustomHtmlElement[];
    spreadsheet?: SpreadsheetWidgetProps;
  };
}

const ReportPageFooter = ({ formId, previousRoute }: ReportPageFooterI) => {
  const navigate = useNavigate();
  return (
    <Box sx={sx.footerBox}>
      <Box>
        <Flex sx={sx.buttonFlex}>
          <Button
            onClick={() => navigate(previousRoute)}
            variant="outline"
            leftIcon={<Icon icon="arrowLeft" />}
          >
            Previous
          </Button>
          <Button
            form={formId}
            type="submit"
            rightIcon={<Icon icon="arrowRight" />}
          >
            Save & continue
          </Button>
        </Flex>
        {/* TODO: Add Prince Print Button */}
      </Box>
    </Box>
  );
};

interface ReportPageFooterI {
  formId: string;
  previousRoute: string;
}

const sx = {
  pageContainer: {
    width: "100%",
    height: "100%",
  },
  reportContainer: {
    flexDirection: "column",
    width: "100%",
    maxWidth: "reportPageWidth",
    marginY: "3.5rem",
    marginLeft: "3.5rem",
    h4: {
      fontSize: "lg",
      fontWeight: "bold",
    },
    h3: {
      fontSize: "lg",
      color: "palette.gray_medium",
      fontWeight: "bold",
      paddingBottom: "0.75rem",
      borderBottom: "1.5px solid var(--chakra-colors-palette-gray_lighter)",
    },
  },
  introBox: {
    marginBottom: "2rem",
  },
  sectionHeading: {
    color: "palette.gray",
    fontSize: "md",
  },
  subsectionHeading: {
    fontWeight: "normal",
    fontSize: "4xl",
  },
  infoTextBox: {
    marginTop: "2rem",
    h4: {
      fontSize: "lg",
      marginBottom: "0.75rem",
    },
    "p, span": {
      color: "palette.gray",
    },
    a: {
      color: "palette.primary",
      "&:hover": {
        color: "palette.primary_darker",
      },
    },
  },
  enterButton: {
    fontSize: "sm",
    fontWeight: "normal",
    height: "1.75rem",
    width: "4.25rem",
  },
  entityRow: {
    justifyContent: "space-between",
    height: "3.25rem",
    padding: "0.5rem",
    paddingLeft: "0.75rem",
    alignItems: "center",
    borderBottom: "1.5px solid var(--chakra-colors-palette-gray_lighter)",
  },
  spreadsheetWidgetBox: {
    marginTop: "2rem",
  },
  footerBox: {
    marginTop: "3.5rem",
    borderTop: "1.5px solid var(--chakra-colors-palette-gray_light)",
  },
  buttonFlex: {
    justifyContent: "space-between",
    marginY: "1.5rem",
  },
};
