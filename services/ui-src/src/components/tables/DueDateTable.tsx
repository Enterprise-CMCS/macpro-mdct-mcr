// components
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "../../utils/useBreakpoint";
// assets
import MCPARDueDatesData from "./data/MCPARDueDates.json";

const rowMap: { [templateName: string]: any } = {
  MCPAR: MCPARDueDatesData,
};

export const DueDateTable = ({ templateName }: Props) => {
  const tableValues = rowMap[templateName];
  const mqClasses = makeMediaQueryClasses();
  return (
    <Table variant="striped" size="sm" data-testid="due-date-table">
      <Thead>
        <Tr>
          <Th sx={sx.tableHeader} className={mqClasses}>
            {tableValues.header.columnOneTitle}
          </Th>
          <Th sx={sx.tableHeader} className={mqClasses}>
            {tableValues.header.columnTwoTitle}
          </Th>
          <Th sx={sx.tableHeader} className={mqClasses}>
            {tableValues.header.columnThreeTitle}
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td sx={sx.tableData} className={mqClasses}>
            {tableValues.bodyRowOne.columnOneValue}
          </Td>
          <Td sx={sx.tableData} className={mqClasses}>
            {tableValues.bodyRowOne.columnTwoValue}
          </Td>
          <Td sx={sx.tableDataDueDate} className={mqClasses}>
            {tableValues.bodyRowOne.columnThreeValue}
          </Td>
        </Tr>
        <Tr>
          <Td sx={sx.tableData} className={mqClasses}>
            {tableValues.bodyRowTwo.columnOneValue}
          </Td>
          <Td sx={sx.tableData} className={mqClasses}>
            {tableValues.bodyRowTwo.columnTwoValue}
          </Td>
          <Td sx={sx.tableDataDueDate} className={mqClasses}>
            {tableValues.bodyRowTwo.columnThreeValue}
          </Td>
        </Tr>
        <Tr>
          <Td sx={sx.tableData} className={mqClasses}>
            {tableValues.bodyRowThree.columnOneValue}
          </Td>
          <Td sx={sx.tableData} className={mqClasses}>
            {tableValues.bodyRowThree.columnTwoValue}
          </Td>
          <Td sx={sx.tableDataDueDate} className={mqClasses}>
            {tableValues.bodyRowThree.columnThreeValue}
          </Td>
        </Tr>
        <Tr>
          <Td sx={sx.tableData} className={mqClasses}>
            {tableValues.bodyRowFour.columnOneValue}
          </Td>
          <Td sx={sx.tableData} className={mqClasses}>
            {tableValues.bodyRowFour.columnTwoValue}
          </Td>
          <Td sx={sx.tableDataDueDate} className={mqClasses}>
            {tableValues.bodyRowFour.columnThreeValue}
          </Td>
        </Tr>
        <Tr>
          <Td sx={sx.tableData} className={mqClasses}>
            {tableValues.bodyRowFive.columnOneValue}
          </Td>
          <Td sx={sx.tableData} className={mqClasses}>
            {tableValues.bodyRowFive.columnTwoValue}
          </Td>
          <Td sx={sx.tableDataDueDate} className={mqClasses}>
            {tableValues.bodyRowFive.columnThreeValue}
          </Td>
        </Tr>
        <Tr>
          <Td sx={sx.tableData} className={mqClasses}>
            {tableValues.bodyRowSix.columnOneValue}
          </Td>
          <Td sx={sx.tableData} className={mqClasses}>
            {tableValues.bodyRowSix.columnTwoValue}
          </Td>
          <Td sx={sx.tableDataDueDate} className={mqClasses}>
            {tableValues.bodyRowSix.columnThreeValue}
          </Td>
        </Tr>
      </Tbody>
    </Table>
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
    textTransform: "none",
    padding: "0.75rem 0.5rem",
    "&.mobile": {
      fontSize: "xs",
    },
  },
  tableData: {
    color: "black",
    fontWeight: "normal",
    padding: "0.75rem 0.5rem",
    borderStyle: "none",
    "&.mobile": {
      fontSize: "xs",
    },
  },
  tableDataDueDate: {
    color: "black",
    fontWeight: "semibold",
    padding: "0.75rem 0.5rem",
    borderStyle: "none",
    "&.mobile": {
      fontSize: "xs",
    },
  },
};
