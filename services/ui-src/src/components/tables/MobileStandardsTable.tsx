import { Box } from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export const MobileStandardsTable = ({ columns, data }: Props) => {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box>
      {table.getRowModel().rows.map((row) => (
        <Box key={row.id}>
          {row.getVisibleCells().map((cell) => {
            return (
              <Box key={cell.id} sx={sx.rows}>
                <Box sx={sx.headers}>
                  {flexRender(
                    cell.column.columnDef.header,
                    cell.getContext() as any
                  )}
                </Box>
                <Box sx={sx.cells}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Box>
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

interface Props {
  columns: any[];
  data: any[];
}

const sx = {
  rows: {
    paddingBottom: "1rem",
  },
  headers: {
    fontWeight: "semibold",
  },
  cells: {},
};
