import { Box, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import { ReportContext, TableRow } from "components";
import { Fragment, useContext } from "react";
import { getRouteStatus } from "utils";

export const StatusTable = () => {
  const { report } = useContext(ReportContext);

  return (
    <Box sx={sx.container}>
      <Table>
        <Tbody>
          <Tr>
            <Td>Section</Td>
            <Td>Status</Td>
            <Td></Td>
          </Tr>
          {getRouteStatus(report).map((route: any) => {
            return (
              <Fragment key={route.path}>
                <TableRow {...route} type="parent" />
                {route.children?.map((child: any) => (
                  <Fragment key={child.path}>
                    <TableRow {...child} type="child" status={child.status} />
                    {child.children?.map((grandchild: any) => (
                      <TableRow
                        key={grandchild.path}
                        {...grandchild}
                        type="grandchild"
                        status={grandchild.status}
                      />
                    ))}
                  </Fragment>
                ))}
              </Fragment>
            );
          })}
        </Tbody>
      </Table>
    </Box>
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
