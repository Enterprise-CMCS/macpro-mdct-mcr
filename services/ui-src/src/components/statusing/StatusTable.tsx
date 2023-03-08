import { Box, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import { ReportContext, TableRow } from "components";
import { Fragment, useContext } from "react";
import { ReportPageProgress } from "types";
import { getRouteStatus } from "utils";

const ChildRow = ({ name, path, children, status }: ReportPageProgress) => {
  return (
    <Fragment key={name}>
      <TableRow name={name} path={path} children={children} status={status} />
      {children?.map((child) => (
        <ChildRow key={child.path} {...child} />
      ))}
    </Fragment>
  );
};

export const StatusTable = () => {
  const { report } = useContext(ReportContext);
  return report ? (
    <Box sx={sx.container}>
      <Table>
        <Tbody>
          <Tr>
            <Td>Section</Td>
            <Td>Status</Td>
            <Td></Td>
          </Tr>
          {getRouteStatus(report).map((page: ReportPageProgress) => {
            return <ChildRow key={page.path} {...page} />;
          })}
        </Tbody>
      </Table>
    </Box>
  ) : (
    <Box />
  );
};

const sx = {
  container: {
    marginTop: "2rem",
    table: {
      tr: {
        borderBottom: "1px solid",
        borderColor: "palette.gray_lighter",
        "&:last-of-type": {
          borderBottom: "none",
        },
      },
      td: {
        borderBottom: "none",
        "&:nth-of-type(1)": {
          width: "20rem",
        },
        "&:last-of-type": {
          textAlign: "right",
        },
      },
    },
  },
};
