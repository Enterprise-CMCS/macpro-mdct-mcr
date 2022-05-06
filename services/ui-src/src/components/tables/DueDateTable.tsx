// components
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "../../utils/useBreakpoint";
import { JsonObject } from "utils/types/types";

export const DueDateTable = ({ verbiage }: Props) => {
  const mqClasses = makeMediaQueryClasses();

  return (
    <Table variant="striped" size="sm" data-testid="due-date-table">
      <Thead>
        <Tr>
          {/* Table Header Row */}
          {verbiage.header.map((headerCell: string, index: number) => (
            <Th key={index} sx={sx.tableHeader} className={mqClasses}>
              {headerCell}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {/* Table Body Rows */}
        {verbiage.rows.map((row: string[], index: number) => (
          <Tr key={index}>
            {/* Row Cells */}
            {row.map((cell: string, index: number) => (
              <Td key={index} sx={sx.tableCell} className={mqClasses}>
                {cell}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

interface Props {
  verbiage: JsonObject;
}

const sx = {
  tableHeader: {
    color: "black",
    fontWeight: "semibold",
    fontSize: "sm",
    textTransform: "none",
    padding: "0.75rem 0.5rem",
    "&.mobile": {
      fontSize: "xs",
    },
  },
  tableCell: {
    color: "black",
    fontWeight: "normal",
    padding: "0.75rem 0.5rem",
    borderStyle: "none",
    "&:last-child": {
      fontWeight: "semibold",
    },
    "&.mobile": {
      fontSize: "xs",
    },
  },
};
