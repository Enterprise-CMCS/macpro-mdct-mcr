// components
import {
  Table as TableRoot,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VisuallyHidden,
} from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "utils";
import { TableContentShape } from "types";

export const Table = ({ content, variant, lastCellsBold, ...props }: Props) => {
  const mqClasses = makeMediaQueryClasses();
  return (
    <TableRoot variant={variant} size="sm" {...props}>
      <VisuallyHidden>
        <TableCaption placement="top">{content.caption}</TableCaption>
      </VisuallyHidden>
      <Thead>
        <Tr>
          {/* Head Row */}
          {content.headRow.map((headerCell: string, index: number) => (
            <Th
              key={index}
              scope="col"
              sx={sx.tableHeader}
              className={mqClasses}
            >
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
