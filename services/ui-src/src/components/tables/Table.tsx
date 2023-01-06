import { ReactNode } from "react";
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
import { sanitizeAndParseHtml } from "utils";
// types
import { AnyObject, TableContentShape } from "types";

export const Table = ({
  content,
  variant,
  sxOverride,
  shrinkCells,
  children,
  ...props
}: Props) => {
  return (
    <TableRoot
      variant={variant}
      size="sm"
      className={shrinkCells && "shrink"}
      sx={{ ...sx.root, ...sxOverride }}
      {...props}
    >
      <TableCaption placement="top" sx={sx.captionBox}>
        <VisuallyHidden>{content.caption}</VisuallyHidden>
      </TableCaption>
      {content.headRow && (
        <Thead>
          {/* Head Row */}
          <Tr>
            {content.headRow.map((headerCell: string, index: number) => (
              <Th key={index} scope="col" sx={sx.tableHeader}>
                {headerCell}
              </Th>
            ))}
          </Tr>
        </Thead>
      )}
      <Tbody>
        {/* if children prop is passed, just render the children */}
        {children && children}
        {/* if content prop is passed, parse and render rows and cells */}
        {content.bodyRows &&
          content.bodyRows!.map((row: string[], index: number) => (
            <Tr key={row[0] + index}>
              {row.map((cell: string, index: number) => (
                <Td key={cell + index} sx={sx.tableCell}>
                  {sanitizeAndParseHtml(cell)}
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
  sxOverride?: AnyObject;
  children?: ReactNode;
  [key: string]: any;
}

const sx = {
  root: {
    width: "100%",
  },
  captionBox: {
    margin: 0,
    padding: 0,
    height: 0,
  },
  tableHeader: {
    padding: "0.75rem 0.5rem",
    fontSize: "sm",
    fontWeight: "semibold",
    textTransform: "none",
    letterSpacing: "normal",
    ".mobile &": {
      fontSize: "xs",
    },
  },
  tableCell: {
    padding: "0.75rem 0.5rem",
    borderStyle: "none",
    fontWeight: "normal",
    ".mobile &": {
      fontSize: "xs",
    },
  },
};
