// components
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
// assets
import MCPARDueDatesData from "./data/MCPARDueDates.json";

const rowMap: { [templateName: string]: any } = {
  MCPAR: MCPARDueDatesData,
};

export const DueDateTable = ({ templateName }: Props) => {
  const tableValues = rowMap[templateName];
  return (
    <TableContainer data-testid="due-date-table">
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th sx={sx.tableHeader}>{tableValues.header.columnOneTitle}</Th>
            <Th sx={sx.tableHeader}>{tableValues.header.columnTwoTitle}</Th>
            <Th sx={sx.tableHeader}>{tableValues.header.columnThreeTitle}</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td sx={sx.tableData}>{tableValues.bodyRowOne.columnOneValue}</Td>
            <Td sx={sx.tableData}>{tableValues.bodyRowOne.columnTwoValue}</Td>
            <Td sx={sx.tableDataDueDate}>
              {tableValues.bodyRowOne.columnThreeValue}
            </Td>
          </Tr>
          <Tr>
            <Td sx={sx.tableData}>{tableValues.bodyRowTwo.columnOneValue}</Td>
            <Td sx={sx.tableData}>{tableValues.bodyRowTwo.columnTwoValue}</Td>
            <Td sx={sx.tableDataDueDate}>
              {tableValues.bodyRowTwo.columnThreeValue}
            </Td>
          </Tr>
          <Tr>
            <Td sx={sx.tableData}>{tableValues.bodyRowThree.columnOneValue}</Td>
            <Td sx={sx.tableData}>{tableValues.bodyRowThree.columnTwoValue}</Td>
            <Td sx={sx.tableDataDueDate}>
              {tableValues.bodyRowThree.columnThreeValue}
            </Td>
          </Tr>
          <Tr>
            <Td sx={sx.tableData}>{tableValues.bodyRowFour.columnOneValue}</Td>
            <Td sx={sx.tableData}>{tableValues.bodyRowFour.columnTwoValue}</Td>
            <Td sx={sx.tableDataDueDate}>
              {tableValues.bodyRowFour.columnThreeValue}
            </Td>
          </Tr>
          <Tr>
            <Td sx={sx.tableData}>{tableValues.bodyRowFive.columnOneValue}</Td>
            <Td sx={sx.tableData}>{tableValues.bodyRowFive.columnTwoValue}</Td>
            <Td sx={sx.tableDataDueDate}>
              {tableValues.bodyRowFive.columnThreeValue}
            </Td>
          </Tr>
          <Tr>
            <Td sx={sx.tableData}>{tableValues.bodyRowSix.columnOneValue}</Td>
            <Td sx={sx.tableData}>{tableValues.bodyRowSix.columnTwoValue}</Td>
            <Td sx={sx.tableDataDueDate}>
              {tableValues.bodyRowSix.columnThreeValue}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

interface Props {
  templateName: string;
}

const sx = {
  tableHeader: {
    color: "black",
    fontWeight: "semibold",
    fontSize: "sm",
  },
  tableData: {
    color: "black",
    fontWeight: "normal",
  },
  tableDataDueDate: {
    color: "black",
    fontWeight: "semibold",
  },
};
