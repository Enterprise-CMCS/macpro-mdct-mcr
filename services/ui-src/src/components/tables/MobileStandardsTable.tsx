import { Box, Text } from "@chakra-ui/react";
import {
  Cell,
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

  // cells with a hidden header will get inline styling
  const isInline = (cell: Cell<any, unknown>) => {
    if (cell.column.getCanSort() === true) {
      return {};
    }

    return sx.inline;
  };

  return (
    <Box>
      {table.getRowModel().rows.map((row) => (
        <Box key={row.id}>
          {row.getVisibleCells().map((cell, index) => {
            const isStandardType = index === 2;

            return (
              <Box key={cell.id} sx={{ ...sx.rows, ...isInline(cell) }}>
                <Box sx={{ ...sx.headers, ...isInline(cell) }}>
                  {flexRender(cell.column.columnDef.header, cell.getContext())}
                </Box>
                <Text
                  sx={{
                    ...isInline(cell),
                    ...(isStandardType && { fontWeight: "bold" }),
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Text>
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
  inline: {
    display: "inline",
  },
};
