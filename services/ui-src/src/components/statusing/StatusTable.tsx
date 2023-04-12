import { Fragment, useContext } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex, Image, Td, Text, Tr } from "@chakra-ui/react";
import { ReportContext, Table } from "components";
// types
import { ReportPageProgress } from "types";
// utils
import { getRouteStatus } from "utils";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-review-and-submit";
// assets
import editIcon from "assets/icons/icon_edit.png";
import errorIcon from "assets/icons/icon_error_circle_bright.png";

export const StatusTable = () => {
  const { report } = useContext(ReportContext);
  const { review } = verbiage;
  const rowDepth = 1;
  return report ? (
    <Box sx={sx.container}>
      <Table content={review.table} sx={sx.table}>
        {getRouteStatus(report).map((page: ReportPageProgress) => {
          return <ChildRow key={page.path} page={page} depth={rowDepth} />;
        })}
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
  const buttonAriaLabel = `Edit  ${name}`;

  return (
    <Tr>
      {depth == 1 ? (
        <Td sx={sx.parent}>{name}</Td>
      ) : (
        <Td sx={sx.subparent} pl={`${1.25 * depth}rem`}>
          {name}
        </Td>
      )}
      <Td>
        {!status && status !== undefined && (
          <Flex sx={sx.status}>
            <Image src={errorIcon} alt="Error notification" />
            <Text>Error</Text>
          </Flex>
        )}
      </Td>

      <Td>
        {!children && (
          <Button
            sx={sx.enterButton}
            variant="outline"
            aria-label={buttonAriaLabel}
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
      td: {
        borderBottom: "none",
      },
    },
  },
  parent: {
    fontWeight: "bold",
    lineHeight: "1.75rem",
  },
  subparent: {
    lineHeight: "1.75rem",
  },
  enterButton: {
    width: "4.25rem",
    height: "1.75rem",
    fontSize: "md",
    fontWeight: "normal",
    border: "1px solid",
    borderColor: "palette.gray_lighter",
    color: "palette.primary",

    img: {
      width: "1rem",
      marginRight: "0.5rem",
    },
  },

  status: {
    gap: "0.5rem",
    alignItems: "center",
    img: {
      width: "1.25rem",
    },
  },

  table: {
    marginBottom: "2.5rem",
    th: {
      padding: "1rem 0 1rem 1rem",
      borderBottom: "1px solid",
      borderColor: "palette.gray_lighter",
      color: "palette.gray_medium",
      fontWeight: "600",
      fontSize: "sm",
    },
    tr: {
      borderBottom: "1px solid",
      borderColor: "palette.gray_lighter",
      color: "palette.base",
    },
    td: {
      minWidth: "6rem",
      paddingTop: ".5rem",
      paddingBottom: ".5rem",
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "palette.gray_lighter",
      textAlign: "left",
      color: "palette.base",
      "&:nth-of-type(1)": {
        width: "20rem",
      },
      "&:last-of-type": {
        textAlign: "right",
        paddingRight: ".5rem",
      },
    },
  },
};
