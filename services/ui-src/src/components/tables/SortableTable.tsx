import { ReactNode, useState } from "react";
// components
import {
  Box,
  Button,
  Image,
  Table as TableRoot,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VisuallyHidden,
} from "@chakra-ui/react";
import {
  AccessorFnColumnDef,
  CellContext,
  ColumnFiltersState,
  createColumnHelper,
  DisplayColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
// types
import { AnyObject, SortableHeadRow, TableContentShape } from "types";
// assets
import downArrowIcon from "assets/icons/icon_arrow_down_gray.png";
import upArrowIcon from "assets/icons/icon_arrow_up_gray.png";

export const SortableTable = ({
  border,
  columns,
  content,
  data,
  initialSorting = [],
  sxOverride,
  variant,
  ...props
}: Props) => {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      sorting,
    },
  });

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
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const ariaSort = header.column.getIsSorted()
                ? {
                    "aria-sort": (header.column.getIsSorted() === "asc"
                      ? "ascending"
                      : "descending") as AriaSortValues,
                  }
                : {};

              return (
                <Th
                  key={header.id}
                  scope="col"
                  sx={{ ...sx.tableHeader, ...sxOverride }}
                  {...ariaSort}
                >
                  {header.column.getCanSort() && (
                    <Button
                      onClick={header.column.getToggleSortingHandler()}
                      size="sm"
                      p={0}
                      height={4}
                      variant="ghost"
                    >
                      <Box as="span">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Box>
                      <Box as="span" w={3} ml={2} aria-hidden="true">
                        {header.column.getIsSorted() === "asc" && (
                          <Image src={upArrowIcon} alt="" />
                        )}
                        {header.column.getIsSorted() === "desc" && (
                          <Image src={downArrowIcon} alt="" />
                        )}
                      </Box>
                    </Button>
                  )}
                  {!header.column.getCanSort() &&
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </Th>
              );
            })}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row) => (
          <Tr key={row.id}>
            {row.getVisibleCells().map((cell) => {
              return (
                <Td
                  key={cell.id}
                  sx={border ? sx.tableCellBorder : sx.tableCell}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              );
            })}
          </Tr>
        ))}
      </Tbody>
    </TableRoot>
  );
};

export function generateColumns<T>(
  headRow: SortableHeadRow,
  isAdmin: boolean,
  customCellsCallback?: (
    headerId: string,
    cellValue: any,
    originalRowData: T
  ) => ReactNode
): (DisplayColumnDef<T, unknown> | AccessorFnColumnDef<T, any>)[] {
  const columnHelper = createColumnHelper<T>();

  function getCell(id: string, info: CellContext<T, unknown>) {
    // Undefined must return null or cell won't render
    const value = info.getValue() ?? null;
    let cell;

    if (customCellsCallback) {
      cell = customCellsCallback(id, value, info.row.original);
    }

    return cell ?? value;
  }

  return Object.keys(headRow)
    .filter((id) => {
      const { admin, stateUser } = headRow[id];
      const hideFromAdmin = isAdmin && stateUser;
      const hideFromStateUser = !isAdmin && admin === true;

      if (hideFromAdmin || hideFromStateUser) {
        return false;
      }
      return true;
    })
    .map((id) => {
      const {
        filter = true,
        header,
        hidden = false,
        sort = true,
      } = headRow[id];

      if (hidden) {
        return columnHelper.display({
          id,
          header: () => <VisuallyHidden>{header}</VisuallyHidden>,
          cell: (info) => getCell(id, info),
        });
      }

      return columnHelper.accessor((row: T) => row[id as keyof T], {
        id,
        header,
        cell: (info) => getCell(id, info),
        enableColumnFilter: filter,
        enableSorting: sort,
      });
    });
}

interface Props {
  border?: boolean;
  columns: any[];
  content: TableContentShape;
  data: any[];
  initialSorting?: SortingState;
  sxOverride?: AnyObject;
  variant?: string;
  [key: string]: any;
}

type AriaSortValues = "ascending" | "descending";

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
    borderColor: "palette.gray_lighter",
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
    borderColor: "palette.gray_lighter",
    fontWeight: "normal",
    ".mobile &": {
      fontSize: "xs",
    },
  },
};
