import { Fragment, useContext } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Image, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import { ReportContext } from "components";
// types
import { ReportPageProgress } from "types";
// utils
import { getRouteStatus } from "utils";
// assets
import editIcon from "assets/icons/icon_edit.png";
import errorIcon from "assets/icons/icon_error_circle.png";

export const StatusTable = () => {
  const { report } = useContext(ReportContext);
  const rowDepth = 1;
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
            return <ChildRow key={page.path} page={page} depth={rowDepth} />;
          })}
        </Tbody>
      </Table>
    </Box>
  ) : (
    <Box />
  );
};

const ChildRow = ({ page, depth }: RowProps) => {
  const { name, children } = page;
  return (
    <Fragment key={name}>
      <TableRow page={page} depth={depth} />
      {children?.map((child) => (
        <ChildRow key={child.path} page={child} depth={depth + 1} />
      ))}
    </Fragment>
  );
};

const TableRow = ({ page, depth }: RowProps) => {
  const navigate = useNavigate();
  const { name, path, children, status } = page;

  return (
    <Tr>
      {depth == 1 ? (
        <Td sx={sx.parent}>{name}</Td>
      ) : (
        <Td pl={`${2.5 * depth}rem`}>{name}</Td>
      )}
      <Td sx={sx.status}>
        {!status && status !== undefined && (
          <>
            <Image src={errorIcon} alt="Error notification" />
            Error
          </>
        )}
      </Td>

      <Td>
        {!children && (
          <Button
            sx={sx.enterButton}
            variant="outline"
            onClick={() => navigate(path)}
          >
            <Image src={editIcon} alt="Edit Program" />
            Edit
          </Button>
        )}
      </Td>
    </Tr>
  );
};

interface RowProps {
  page: ReportPageProgress;
  depth: number;
}

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
  parent: {
    fontWeight: "bold",
  },
  enterButton: {
    width: "4.25rem",
    height: "1.75rem",
    fontSize: "md",
    fontWeight: "normal",

    img: {
      width: "1rem",
      marginRight: "0.5rem",
    },
  },
  status: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    img: {
      width: "1.5rem",
    },
  },
};
