import { Box, Heading } from "@chakra-ui/react";
import { StickyBanner, ReportContext, Table, FieldsSection } from "components";

import { useContext } from "react";
import { convertDateUtcToEt } from "utils";

import addEditProgram from "../../../forms/addEditProgram/addEditProgram.json";

export const McparPdfExport = () => {
  const data = useContext(ReportContext);
  const chipCopy = addEditProgram.fields.filter(
    (f) => f.id === "combinedData"
  )[0];

  return (
    <Box data-testid="mcparPdfExport" sx={sx.container}>
      <StickyBanner />
      {data.report && (
        <Box sx={sx.innerContainer}>
          <Heading as="h1" sx={sx.heading}>
            {`Managed Care Program Annual Report (MCPAR) for ${data.report.fieldData.stateName}: ${data.report.programName}`}
          </Heading>

          <Table
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
            sx={sxDataTable}
            className="short"
            content={{
              headRow: ["Indicator", "Response"],
              bodyRows: [
                [
                  `<p><strong>${chipCopy.props.label}</strong></p><p class='message'>${chipCopy.props.hint}</p>`,
                  data.report.combinedData ? "Selected" : "Not Selected",
                ],
              ],
            }}
          />

          {data.report.formTemplate.routes.map((section) => (
            <FieldsSection section={section} key={section.path} />
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
  metaTable: {
    margin: "3rem 0",
    maxWidth: "reportPageWidth",
    th: {
      border: "none",
    },
  },
};

export const sxDataTable = {
  marginBottom: "1rem",
  p: {
    strong: {
      display: "inline-block",
      fontSize: "1rem",
      marginBottom: "0.5rem",
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
      "&:first-of-type": {
        width: "5.5rem",
      },
      "&:nth-last-of-type(2)": {
        width: "14rem",
      },
    },
  },
  "&.short": {
    tr: {
      "th, td": {
        "&:first-of-type": {
          ".desktop &": {
            paddingLeft: "6rem",
          },
        },
        "&:nth-last-of-type(2)": {
          width: "19.5rem",
        },
      },
    },
  },
};
