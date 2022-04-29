// components
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

/* eslint-disable */

// const rowMap: { [templateName: string]: Object } = {
//   MCPAR: {
//     header: {
//       columnOneTitle: "Contract Year",
//       columnTwoTitle: "Contract Period",
//       columnThreeTitle: "Due Date",
//     },
//   },
//   boxArrowRight: {},
//   chevronDown: {},
// };

export const DueDateTable = ({ templateName }: Props) => {
  console.log(
    "There's probably a good way to map this to json somehow",
    templateName
  );
  return (
    <TableContainer>
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th color="black" fontWeight={"semibold"} fontSize={"sm"}>
              Contract Year
            </Th>
            <Th color="black" fontWeight={"semibold"} fontSize={"sm"}>
              Contract Period
            </Th>
            <Th color="black" fontWeight={"semibold"} fontSize={"sm"}>
              Due Date
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td color="black" fontWeight={"normal"}>
              Jul to Jun
            </Td>
            <Td color="black" fontWeight={"normal"}>
              7/2/21 to 6/30/22
            </Td>
            <Td color="black" fontWeight={"semibold"}>
              Dec 27, 2022
            </Td>
          </Tr>
          <Tr>
            <Td color="black" fontWeight={"normal"}>
              Sep to Aug
            </Td>
            <Td color="black" fontWeight={"normal"}>
              9/1/21 to 8/21/22
            </Td>
            <Td color="black" fontWeight={"semibold"}>
              Feb 27, 2023
            </Td>
          </Tr>
          <Tr>
            <Td color="black" fontWeight={"normal"}>
              Oct to Sep
            </Td>
            <Td color="black" fontWeight={"normal"}>
              10/1/21 to 9/30/22
            </Td>
            <Td color="black" fontWeight={"semibold"}>
              Mar 29, 2023
            </Td>
          </Tr>
          <Tr>
            <Td color="black" fontWeight={"normal"}>
              Jan to Dec
            </Td>
            <Td color="black" fontWeight={"normal"}>
              1/1/22 to 12/31/22
            </Td>
            <Td color="black" fontWeight={"semibold"}>
              Jun 29, 2023
            </Td>
          </Tr>
          <Tr>
            <Td color="black" fontWeight={"normal"}>
              Feb to Jan
            </Td>
            <Td color="black" fontWeight={"normal"}>
              2/1/22 to 1/31/23
            </Td>
            <Td color="black" fontWeight={"semibold"}>
              Jul 30, 2023
            </Td>
          </Tr>
        </Tbody>
        <Tfoot>
          <Tr>
            <Td color="black" fontWeight={"normal"}>
              Apr to Mar
            </Td>
            <Td color="black" fontWeight={"normal"}>
              4/1/22 to 3/31/23
            </Td>
            <Td color="black" fontWeight={"semibold"}>
              Sep 27, 2023
            </Td>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};

interface Props {
  templateName: string;
}
