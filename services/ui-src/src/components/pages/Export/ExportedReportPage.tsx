import { useContext } from "react";
// components
import { Box, Heading } from "@chakra-ui/react";
import { StickyBanner, ReportContext, Table, FieldsSection } from "components";
// verbiage
import verbiage from "verbiage/pages/exportedReport";
// utils
import { convertDateUtcToEt } from "utils";

export const ExportedReportPage = () => {
  const { report } = useContext(ReportContext);
  const { combinedData } = verbiage;

  return (
    <Box data-testid="exportedReportPage" sx={sx.container}>
      <StickyBanner />
      {report && (
        <Box sx={sx.innerContainer}>
          <Heading as="h1" sx={sx.heading}>
            Managed Care Program Annual Report (MCPAR) for{" "}
            {report.fieldData.stateName}: {report.programName}
          </Heading>

          <Table
            shrinkCells
            sx={sx.metaTable}
            content={{
              headRow: ["Due Date", "Last edited", "Edited By", "Status"],
              bodyRows: [
                [
                  convertDateUtcToEt(report.dueDate),
                  convertDateUtcToEt(report.lastAltered),
                  report.lastAlteredBy,
                  report.status,
                ],
              ],
            }}
          />
          <Table
            sx={sx.chipTable}
            className="short"
            content={{
              headRow: ["Indicator", "Response"],
              bodyRows: [
                [
                  `<p><strong>${combinedData.label}</strong></p><p class='message'>${combinedData.hint}</p>`,
                  report.combinedData ? "Selected" : "Not Selected",
                ],
              ],
            }}
          />

          {report.formTemplate.routes.map((section) => (
            <FieldsSection section={section} key={section.path} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export const sx = {
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
  chipTable: {
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
