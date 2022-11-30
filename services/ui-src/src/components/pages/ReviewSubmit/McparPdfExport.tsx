import { Box, Heading } from "@chakra-ui/react";
import {
  StickyBanner,
  ReportContext,
  Table,
  SpreadsheetWidget,
} from "components";

import { useContext } from "react";
import { convertDateUtcToEt, parseCustomHtml } from "utils";

import addEditProgram from "../../../forms/addEditProgram/addEditProgram.json";

export const McparPdfExport = () => {
  const data = useContext(ReportContext);
  const chipCopy = addEditProgram.fields.filter(
    (f) => f.id === "combinedData"
  )[0];

  return (
    <Box sx={sx.container}>
      <StickyBanner />
      {data.report && (
        <Box sx={sx.innerContainer}>
          <Heading as="h1" sx={sx.heading}>
            {`Managed Care Program Annual Report (MCPAR) for ${data.report.fieldData.stateName}: ${data.report.programName}`}
          </Heading>
          <Table
            noDivider
            shrinkCells
            sx={sx.metaTable}
            content={{
              headRow: ["Due Date", "Last edited", "Edited By", "Status"],
              bodyRows: [
                [
                  `${convertDateUtcToEt(data.report.dueDate)}`,
                  `${convertDateUtcToEt(data.report.lastAltered)}`,
                  `${data.report.lastAlteredBy}`,
                  `${data.report.status}`,
                ],
              ],
            }}
          />
          <Table
            sx={sx.dataTable}
            className="short"
            content={{
              headRow: ["Indicator", "Response"],
              bodyRows: [
                [
                  `<p class='heading'>${chipCopy.props.label}</p><p class='message'>${chipCopy.props.hint}</p>`,
                  data.report.combinedData ? "Selected" : "Not Selected",
                ],
              ],
            }}
          />
          {data.report.formTemplate.routes.map((route) => (
            <Box mt="5rem" key={route.path}>
              <Heading as="h2" sx={sx.sectionHeading}>
                {`Section ${route.name}`}
              </Heading>

              {route.children?.map((child) => {
                const sectionHeading =
                  child.verbiage?.intro.subsection || child.name;
                return (
                  <Box mt="2rem" key={child.path}>
                    <Heading as="h3" sx={sx.childHeading}>
                      {sectionHeading}
                    </Heading>

                    {child.verbiage?.intro.info && (
                      <Box sx={sx.intro}>
                        {parseCustomHtml(child.verbiage?.intro.info)}
                      </Box>
                    )}

                    {child.verbiage?.intro.spreadsheet && (
                      <SpreadsheetWidget
                        description={child.verbiage?.intro.spreadsheet}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

const sx = {
  container: {
    width: "100%",
    maxWidth: "55.25rem",
    margin: "0 auto",
  },
  innerContainer: {
    width: "100%",
    maxWidth: "40rem",
    margin: "0 auto 0 0",
  },
  heading: {
    fontWeight: "300",
    lineHeight: "lineHeights.heading",
    fontSize: "2rem",
  },
  sectionHeading: {
    fontWeight: "bold",
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
  },
  childHeading: {
    fontWeight: "bold",
    fontSize: "1.3rem",
    marginBottom: "1.5rem",
  },
  metaTable: {
    margin: "3rem 0",
    maxWidth: "reportPageWidth",
    th: {
      border: "none",
    },
  },
  intro: {
    p: {
      margin: "1.5rem 0",
    },
  },
  dataTable: {
    marginBottom: "1rem",
    p: {
      "&.heading": {
        fontWeight: "bold",
        fontSize: "1rem",
        marginBottom: "1rem",
      },
    },
    "th, td": {
      verticalAlign: "top",
      lineHeight: "base",
      borderBottom: "1px solid",
      borderColor: "palette.gray_lighter",
    },
    "&.standard": {
      "th, td": {
        "&:first-child": {
          width: "5.5rem",
        },
        "&:nth-last-child(2)": {
          width: "14.5rem",
        },
      },
    },
    "&.short": {
      tr: {
        "th, td": {
          "&:first-child": {
            ".desktop &": {
              paddingLeft: "6rem",
            },
          },
          "&:nth-last-child(2)": {
            width: "20rem",
          },
        },
      },
    },
  },
};
