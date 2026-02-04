import { ReactNode } from "react";
// components
import {
  SystemStyleObject,
  Table as TableRoot,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VisuallyHidden,
} from "@chakra-ui/react";
// types
import { ScreenReaderCustomHeaderName, TableContentShape } from "types";
// utils
import { sanitizeAndParseHtml } from "utils";

export const Table = ({
  content,
  variant,
  border,
  sxOverride,
  children,
  ...props
}: Props) => {
  return (
    <TableRoot
      variant={variant}
      size="sm"
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
            {content.headRow.map(
              (
                headerCell: string | ScreenReaderCustomHeaderName,
                index: number
              ) => (
                <Th
                  key={index}
                  scope="col"
                  sx={{ ...sx.tableHeader, ...sxOverride }}
                >
                  {typeof headerCell === "object" ? (
                    <>
                      <VisuallyHidden>
                        {sanitizeAndParseHtml(headerCell.hiddenName)}
                      </VisuallyHidden>
                      {headerCell?.name ? headerCell.name : null}
                    </>
                  ) : (
                    sanitizeAndParseHtml(headerCell)
                  )}
                </Th>
              )
            )}
          </Tr>
        </Thead>
      )}
      <Tbody>
        {/* if children prop is passed, just render the children */}
        {children}
        {/* if content prop is passed, parse and render rows and cells */}
        {content.bodyRows &&
          content.bodyRows!.map((row: string[], index: number) => (
            <Tr key={row[0] + index}>
              {row.map((cell: string, index: number) => (
                <Td
                  key={cell + index}
                  sx={border ? sx.tableCellBorder : sx.tableCell}
                >
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
  border?: boolean;
  sxOverride?: SystemStyleObject;
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
    borderColor: "gray_lighter",
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
  tableCellBorder: {
    padding: "0.75rem 0.5rem",
    borderBottom: "1px solid",
    borderColor: "gray_lighter",
    fontWeight: "normal",
    ".mobile &": {
      fontSize: "xs",
    },
  },
};
