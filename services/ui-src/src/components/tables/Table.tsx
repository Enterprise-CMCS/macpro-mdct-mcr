// components
import { Table as TableRoot, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "../../utils/useBreakpoint";
import { TableContentShape } from "utils/types/types";

export const Table = ({
  content,
  variant,
  lastCellsBold,
  dataTestId,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();
  return (
    <TableRoot
      variant={variant}
      size="sm"
      data-testid={dataTestId || "table"}
      {...props}
    >
      <Thead>
        <Tr>
          {/* Head Row */}
          {content.headRow.map((headerCell: string, index: number) => (
            <Th key={index} sx={sx.tableHeader} className={mqClasses}>
              {headerCell}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {/* Body Rows */}
        {content.bodyRows.map((row: string[], index: number) => (
          <Tr key={index}>
            {/* Row Cells */}
            {row.map((cell: string, index: number) => (
              <Td
                key={index}
                sx={sx.tableCell}
                className={`${mqClasses}${
                  lastCellsBold ? " boldLastCell" : ""
                }`}
              >
                {cell}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </TableRoot>
  );
};

interface Props {
  content: TableContentShape;
  variant?: string;
  lastCellsBold?: boolean;
  dataTestId?: string;
  [key: string]: any;
}

const sx = {
  tableHeader: {
    padding: "0.75rem 0.5rem",
    fontSize: "sm",
    fontWeight: "semibold",
    textTransform: "none",
    letterSpacing: "normal",
    color: "black",
    "&.mobile": {
      fontSize: "xs",
    },
  },
  tableCell: {
    padding: "0.75rem 0.5rem",
    borderStyle: "none",
    fontWeight: "normal",
    color: "black",
    "&.boldLastCell:last-child": {
      fontWeight: "semibold",
    },
    "&.mobile": {
      fontSize: "xs",
    },
  },
};
