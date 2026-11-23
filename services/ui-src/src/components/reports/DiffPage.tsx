import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  List,
  ListItem,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { diffAtom } from "json-diff-ts";
import diff from "microdiff";
import * as jsondiffpatch from "jsondiffpatch";
import * as htmlFormatter from "jsondiffpatch/formatters/html";
import "jsondiffpatch/formatters/styles/html.css";
import { useStore } from "utils";

export const DiffPage = () => {
  const { report, previousReport } = useStore();
  const diffLibraries = ["json-diff-ts", "microdiff", "jsondiffpatch"];
  const [diffId, setDiffId] = useState<string>(diffLibraries[0]);
  const [differences, setDifferences] = useState<any[] | null>(null);
  const [showText, setShowText] = useState<boolean>(true);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [showVisualization, setShowVisualization] = useState<boolean>(false);
  const [html, setHtml] = useState<string>("");

  const reset = () => {
    setDifferences(null);
    setShowText(true);
    setShowTable(false);
    setShowVisualization(false);
  };

  useEffect(() => {
    reset();

    if (!report || !previousReport || report.previousRevisions.length === 0) {
      return;
    }

    const normalizeDiffs = (diffs: any, diffId: string) => {
      if (diffId !== "json-diff-ts") return diffs;

      return diffs.operations.map((d: any) => {
        const typeMap = {
          replace: "CHANGE",
          remove: "REMOVE",
          add: "CREATE",
        } as Record<string, string>;
        const type = typeMap[d.op as string];
        const path = d.path;
        const value = d.value;
        const oldValue = d.oldValue;

        return {
          originalType: d.op,
          type,
          path,
          value,
          oldValue,
        };
      });
    };

    let fieldDataDiff: any;

    if (diffId === "microdiff") {
      fieldDataDiff = diff(previousReport.fieldData, report.fieldData);
    } else if (diffId === "json-diff-ts") {
      fieldDataDiff = diffAtom(previousReport.fieldData, report.fieldData);
    } else if (diffId === "jsondiffpatch") {
      fieldDataDiff = jsondiffpatch.diff(
        previousReport.fieldData,
        report.fieldData
      );
    }
    const newDiff = normalizeDiffs(fieldDataDiff, diffId);

    if (diffId === "jsondiffpatch") {
      setHtml(htmlFormatter.format(fieldDataDiff) || "");
    }

    setDifferences(newDiff);
    setShowText(false);
    setShowTable(diffId !== "jsondiffpatch");
    setShowVisualization(diffId === "jsondiffpatch");
  }, [report, previousReport, diffId]);

  const displayPreviousValue = (d: any) => {
    if (d.type === "CREATE") {
      return;
    }
    return displayValue(d.oldValue);
  };

  const displayRevisedValue = (d: any) => {
    if (d.type === "REMOVE") {
      return;
    }
    return displayValue(d.value);
  };

  const displayValue = (value: any) => {
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const getText = () => {
    if (!report || report.previousRevisions.length === 0)
      return "No previous revisions available.";
    if (!differences) return "Loading...";
    return "No differences found for this revision.";
  };

  return (
    <Box>
      <Heading as="h1" mb="spacer3">
        Diff POC
      </Heading>

      <Box>
        {diffLibraries.map((d) => (
          <Button
            key={d}
            mb="spacer3"
            mr="spacer1"
            onClick={() => setDiffId(d)}
            variant={d === diffId ? "primary" : "outline"}
          >
            {d}
          </Button>
        ))}
      </Box>

      <Heading as="h2" fontSize="body_xl" mb="spacer3">
        Compare to Previous Revision
      </Heading>

      <Button
        as="a"
        href={`/${report?.reportType.toLowerCase()}/export/diff`}
        mb="spacer3"
        target="_blank"
        variant="outline"
      >
        View PDF
      </Button>

      {showText && <Text mb="spacer3">{getText()}</Text>}

      {showTable && (
        <>
          <List mb="spacer3">
            <ListItem>
              <strong>Updated:</strong>{" "}
              {differences?.filter((d) => d.type === "CHANGE").length}
            </ListItem>
            <ListItem>
              <strong>Removed:</strong>{" "}
              {differences?.filter((d) => d.type === "REMOVE").length}
            </ListItem>
            <ListItem>
              <strong>Added:</strong>{" "}
              {differences?.filter((d) => d.type === "CREATE").length}
            </ListItem>
            <ListItem>
              <strong>Total differences:</strong> {differences?.length}
            </ListItem>
          </List>
          <Table>
            <Thead>
              <Tr>
                <Th>Type</Th>
                <Th>Path</Th>
                <Th>Revised Value</Th>
                <Th>Previous Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              {differences?.map((d, i) => (
                <Tr key={`diff-${i}`}>
                  <Td>{d.originalType || d.type}</Td>
                  <Td>
                    <Box overflow="scroll" maxHeight="200px">
                      <Box whiteSpace="pre-wrap" width="250px">
                        {displayValue(d.path)}
                      </Box>
                    </Box>
                  </Td>
                  <Td>
                    <Box overflow="scroll" maxHeight="200px">
                      <Box whiteSpace="pre-wrap" width="250px">
                        {displayRevisedValue(d)}
                      </Box>
                    </Box>
                  </Td>
                  <Td>
                    <Box overflow="scroll" maxHeight="200px">
                      <Box whiteSpace="pre-wrap" width="250px">
                        {displayPreviousValue(d)}
                      </Box>
                    </Box>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}

      {showVisualization && <Box dangerouslySetInnerHTML={{ __html: html }} />}
    </Box>
  );
};
