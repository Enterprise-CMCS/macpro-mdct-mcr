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

/* eslint-disable */

const rowMap: { [templateName: string]: any } = {
  MCPAR: MCPARDueDatesData,
  MLR: {},
  ASR: {},
};

export const DueDateTable = ({ templateName }: Props) => {
  const tableValues = rowMap[templateName];
  return (
    <TableContainer data-testid="due-date-table">
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th color="black" fontWeight={"semibold"} fontSize={"sm"}>
              {tableValues.header.columnOneTitle}
            </Th>
            <Th color="black" fontWeight={"semibold"} fontSize={"sm"}>
              {tableValues.header.columnTwoTitle}
            </Th>
            <Th color="black" fontWeight={"semibold"} fontSize={"sm"}>
              {tableValues.header.columnThreeTitle}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td color="black" fontWeight={"normal"}>
              {tableValues.bodyRowOne.columnOneValue}
            </Td>
            <Td color="black" fontWeight={"normal"}>
              {tableValues.bodyRowOne.columnTwoValue}
            </Td>
            <Td color="black" fontWeight={"semibold"}>
              {tableValues.bodyRowOne.columnThreeValue}
            </Td>
          </Tr>
          <Tr>
            <Td color="black" fontWeight={"normal"}>
              {tableValues.bodyRowTwo.columnOneValue}
            </Td>
            <Td color="black" fontWeight={"normal"}>
              {tableValues.bodyRowTwo.columnTwoValue}
            </Td>
            <Td color="black" fontWeight={"semibold"}>
              {tableValues.bodyRowTwo.columnThreeValue}
            </Td>
          </Tr>
          <Tr>
            <Td color="black" fontWeight={"normal"}>
              {tableValues.bodyRowThree.columnOneValue}
            </Td>
            <Td color="black" fontWeight={"normal"}>
              {tableValues.bodyRowThree.columnTwoValue}
            </Td>
            <Td color="black" fontWeight={"semibold"}>
              {tableValues.bodyRowThree.columnThreeValue}
            </Td>
          </Tr>
          <Tr>
            <Td color="black" fontWeight={"normal"}>
              {tableValues.bodyRowFour.columnOneValue}
            </Td>
            <Td color="black" fontWeight={"normal"}>
              {tableValues.bodyRowFour.columnTwoValue}
            </Td>
            <Td color="black" fontWeight={"semibold"}>
              {tableValues.bodyRowFour.columnThreeValue}
            </Td>
          </Tr>
          <Tr>
            <Td color="black" fontWeight={"normal"}>
              {tableValues.bodyRowFive.columnOneValue}
            </Td>
            <Td color="black" fontWeight={"normal"}>
              {tableValues.bodyRowFive.columnTwoValue}
            </Td>
            <Td color="black" fontWeight={"semibold"}>
              {tableValues.bodyRowFive.columnThreeValue}
            </Td>
          </Tr>
          <Tr>
            <Td color="black" fontWeight={"normal"}>
              {tableValues.bodyRowSix.columnOneValue}
            </Td>
            <Td color="black" fontWeight={"normal"}>
              {tableValues.bodyRowSix.columnTwoValue}
            </Td>
            <Td color="black" fontWeight={"semibold"}>
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
