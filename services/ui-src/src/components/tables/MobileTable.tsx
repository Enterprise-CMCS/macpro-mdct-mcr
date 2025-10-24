import { Box, Text } from "@chakra-ui/react";
import {
  Cell,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export const MobileTable = ({ columns, data }: Props) => {
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
        <Box key={row.id} sx={sx.border}>
          {row.getVisibleCells().map((cell) => (
            <Box key={cell.id} sx={{ ...sx.rows, ...isInline(cell) }}>
              <Text sx={{ ...sx.headers, ...isInline(cell) }}>
                {flexRender(cell.column.columnDef.header, cell.getContext())}
              </Text>
              <Text sx={{ ...isInline(cell) }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Text>
            </Box>
          ))}
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
    paddingBottom: "spacer2",
  },
  headers: {
    fontWeight: "semibold",
  },
  inline: {
    display: "inline",
  },
  border: {
    borderBottom: "1px solid",
    borderColor: "gray_lighter",
    padding: "1rem 0",
  },
};
