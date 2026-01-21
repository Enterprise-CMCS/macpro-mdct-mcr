import { ReactNode, useEffect, useRef, useState } from "react";
// components
import {
  Box,
  Button,
  Image,
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
import {
  AccessorFnColumnDef,
  CellContext,
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
// types
import { SortableHeadRow, TableContentShape } from "types";
// assets
import downArrowIcon from "assets/icons/icon_arrow_alt_down_solid.png";
import upArrowIcon from "assets/icons/icon_arrow_alt_up_solid.png";
import upDownArrowIcon from "assets/icons/icon_arrows_alt_v_solid.png";
import uuid from "react-uuid";

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
  const headerRefs = useRef<{ [key: string]: HTMLElement }>({});
  const tableInstanceId = uuid();
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [headerLabels, setHeaderLabels] = useState<{ [key: string]: string }>(
    {}
  );
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

  useEffect(() => {
    const relKeys = Object.keys(headerRefs.current);
    const refLabels = relKeys.reduce(
      (obj, key) => {
        obj[key] = headerRefs.current[key].textContent || "";
        return obj;
      },
      {} as { [key: string]: string }
    );
    setHeaderLabels(refLabels);
  }, [headerRefs.current]);

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
                  aria-labelledby={`${tableInstanceId}-header-${header.id}`}
                >
                  {header.column.getCanSort() && (
                    <Button
                      onClick={header.column.getToggleSortingHandler()}
                      size="sm"
                      p={0}
                      height={4}
                      variant="ghost"
                      aria-label={headerLabels[header.id]}
                    >
                      <Box
                        as="span"
                        id={`${tableInstanceId}-header-${header.id}`}
                        ref={(el: HTMLElement | null) =>
                          (headerRefs.current[header.id] = el as HTMLElement)
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Box>
                      <Box as="span" w={3} ml={2} aria-hidden="true">
                        {!header.column.getIsSorted() && (
                          <Image src={upDownArrowIcon} alt="Not sorted" />
                        )}
                        {header.column.getIsSorted() === "asc" && (
                          <Image src={upArrowIcon} alt="Sort ascending" />
                        )}
                        {header.column.getIsSorted() === "desc" && (
                          <Image src={downArrowIcon} alt="Sort descending" />
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

export function generateColumns<TData>(
  headRow: SortableHeadRow,
  isAdmin: boolean,
  customCellsCallback?: (
    headKey: keyof TData,
    cellValue: any,
    originalRowData: TData
  ) => ReactNode
): AccessorFnColumnDef<TData, any>[] {
  const columnHelper = createColumnHelper<TData>();

  function getCell(headKey: keyof TData, info: CellContext<TData, unknown>) {
    // Undefined must return null or cell won't render
    const value = info.getValue() ?? null;
    let cell;

    if (customCellsCallback) {
      cell = customCellsCallback(headKey, value, info.row.original);
    }

    return cell ?? value;
  }

  return Object.keys(headRow)
    .filter((headKey) => {
      const { admin, stateUser } = headRow[headKey];
      const hideFromAdmin = isAdmin && stateUser;
      const hideFromStateUser = !isAdmin && admin === true;

      if (hideFromAdmin || hideFromStateUser) {
        return false;
      }
      return true;
    })
    .map((headKey) => {
      const {
        filter = true,
        header,
        hidden = false,
        sort = true,
      } = headRow[headKey];

      return columnHelper.accessor(
        (row: TData) => row[headKey as keyof TData],
        {
          id: headKey,
          header: () =>
            hidden ? <VisuallyHidden>{header}</VisuallyHidden> : header,
          cell: (info) => getCell(headKey as keyof TData, info),
          enableColumnFilter: hidden ? false : filter,
          enableSorting: hidden ? false : sort,
        }
      );
    });
}

interface Props {
  border?: boolean;
  columns: any[];
  content: TableContentShape;
  data: any[];
  initialSorting?: SortingState;
  sxOverride?: SystemStyleObject;
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
    borderColor: "gray_lighter",
    textTransform: "none",
    letterSpacing: "normal",
  },
  tableCell: {
    padding: "0.75rem 0.5rem",
    borderStyle: "none",
    fontWeight: "normal",
  },
  tableCellBorder: {
    padding: "0.75rem 0.5rem",
    borderBottom: "1px solid",
    borderColor: "gray_lighter",
    fontWeight: "normal",
  },
};
