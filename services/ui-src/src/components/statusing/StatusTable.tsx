import { Box, Table, Td, Tr } from "@chakra-ui/react";
import { ReportContext, TableRow } from "components";
import { useContext } from "react";

export const StatusTable = () => {
  const { report } = useContext(ReportContext);
  return (
    <Box sx={sx.container}>
      <Table>
        <Tr>
          <Td>Section</Td>
          <Td>Status</Td>
          <Td></Td>
        </Tr>

        {report?.formTemplate.routes
          .filter((r) => r.pageType !== "reviewSubmit")
          .map((route) => {
            return (
              <>
                <TableRow {...route} type="parent" />
                {route.children?.map((child: any) => (
                  <>
                    <TableRow {...child} type="child" status="success" />
                    {child.children?.map((grandchild: any) => (
                      <TableRow
                        {...grandchild}
                        type="grandchild"
                        status="error"
                      />
                    ))}
                  </>
                ))}
              </>
            );
          })}
      </Table>
    </Box>
  );
};

const sx = {
  container: {
    marginTop: "5rem",
  },
};
