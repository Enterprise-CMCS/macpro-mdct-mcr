import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex, Image, Td, Text, Tr } from "@chakra-ui/react";
import { Table } from "components";
// types
import { ReportPageProgress, ReportType } from "types";
// utils
import {
  assertExhaustive,
  getRouteStatus,
  useBreakpoint,
  useStore,
} from "utils";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-review-and-submit";
// assets
import editIcon from "assets/icons/icon_edit.png";
import errorIcon from "assets/icons/icon_error_circle_bright.png";
import successIcon from "assets/icons/icon_check_circle.png";

export const StatusTable = () => {
  const { report } = useStore();
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

export const StatusIcon = ({
  reportType,
  status,
}: {
  reportType: ReportType;
  status?: boolean;
}) => {
  switch (reportType) {
    case ReportType.MLR: {
      if (status) {
        return (
          <Flex sx={sx.status}>
            <Image src={successIcon} alt="Success notification" />
            <Text>Complete</Text>
          </Flex>
        );
      } else if (status === undefined) {
        return <></>;
      } else {
        return (
          <Flex sx={sx.status}>
            <Image src={errorIcon} alt="Error notification" />
            <Text>Error</Text>
          </Flex>
        );
      }
    }
    case ReportType.NAAAR:
    case ReportType.MCPAR: {
      if (status || status === undefined) {
        return <></>;
      } else {
        return (
          <Flex sx={sx.status}>
            <Image src={errorIcon} alt="Error notification" />
            <Text>Error</Text>
          </Flex>
        );
      }
    }
    default:
      assertExhaustive(reportType);
      throw new Error(
        `Statusing icons for '${reportType}' have not been implemented.`
      );
  }
};

const TableRow = ({ page, depth }: RowProps) => {
  const { isMobile } = useBreakpoint();
  const { name, path, children, status } = page;
  const buttonAriaLabel = `Edit  ${name}`;
  const { report } = useStore();
  return (
    <Tr>
      {depth == 1 ? (
        <Td sx={sx.parent} pl={!isMobile ? "1rem" : "0"}>
          <Text>{name}</Text>
          {isMobile && !children && EditButton(buttonAriaLabel, path)}
        </Td>
      ) : (
        <Td sx={sx.subparent} pl={!isMobile ? `${1.25 * depth}rem` : "0"}>
          <Text>{name}</Text>
          {isMobile && !children && EditButton(buttonAriaLabel, path)}
        </Td>
      )}
      <Td
        sx={sx.statusColumn}
        pt={
          depth == 1
            ? isMobile
              ? "1.5rem"
              : "spacer1"
            : isMobile
            ? "1rem"
            : "spacer1"
        }
      >
        <StatusIcon
          reportType={report?.reportType as ReportType}
          status={status}
        />
      </Td>
      {!isMobile && (
        <Td>{!children && EditButton(buttonAriaLabel, path, true)}</Td>
      )}
    </Tr>
  );
};

const EditButton = (
  buttonAriaLabel: string,
  path: string,
  showIcon = false
) => {
  const navigate = useNavigate();
  return (
    <Button
      sx={sx.enterButton}
      variant="outline"
      aria-label={buttonAriaLabel}
      onClick={() => navigate(path, { state: { validateOnRender: true } })}
    >
      {showIcon && <Image src={editIcon} alt="Edit Program" />}
      Edit
    </Button>
  );
};

interface RowProps {
  page: ReportPageProgress;
  depth: number;
}

const sx = {
  container: {
    marginTop: "spacer4",
    table: {
      td: {
        borderBottom: "none",
      },
    },
  },
  parent: {
    fontWeight: "bold",
    lineHeight: "1.125rem",
    fontSize: "sm",
    paddingTop: "spacer2",
    paddingBottom: "spacer2",
    ".mobile &": {
      paddingTop: "spacer3",
      paddingBottom: "spacer3",
    },
  },
  subparent: {
    paddingTop: "spacer2",
    paddingBottom: "spacer2",
    lineHeight: "1.125rem",
    fontSize: "sm",
  },
  enterButton: {
    width: "4.25rem",
    height: "1.75rem",
    fontSize: "md",
    fontWeight: "normal",
    border: "1px solid",
    borderColor: "gray_lighter",
    color: "primary",
    ".mobile &": {
      width: "6rem",
      borderColor: "primary",
      marginTop: "spacer1",
    },
    img: {
      width: "1rem",
      marginRight: "spacer1",
    },
  },
  statusColumn: {
    ".mobile &": {
      display: "flex",
      borderTop: 0,
      paddingLeft: 0,
    },
  },
  status: {
    gap: "spacer1",
    alignItems: "center",
    img: {
      width: "1.25rem",
    },
    margin: 0,
    padding: 0,
  },

  table: {
    marginBottom: "spacer5",
    th: {
      padding: "1rem 0 1rem 1rem",
      borderBottom: "1px solid",
      borderColor: "gray_lighter",
      color: "gray",
      fontWeight: "600",
      fontSize: "sm",
      lineHeight: "1.125rem",
      ".mobile &": {
        padding: "0.75rem 0rem",
      },
    },
    tr: {
      borderBottom: "1px solid",
      borderColor: "gray_lighter",
      color: "base",
      "&:last-child": {
        borderBottom: 0,
      },
    },
    td: {
      minWidth: "6rem",
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "gray_lighter",
      textAlign: "left",
      color: "base",
      "&:nth-of-type(1)": {
        width: "20rem",
      },
      "&:last-of-type": {
        textAlign: "right",
        paddingRight: "spacer1",
      },
    },
  },
};
