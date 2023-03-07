import { Button, Image, Td, Tr } from "@chakra-ui/react";
import editIcon from "assets/icons/icon_edit.png";
import errorIcon from "assets/icons/icon_error_circle.png";
import { useNavigate } from "react-router-dom";
import { ReportPageProgress } from "types";

export const TableRow = ({
  name,
  children,
  status,
  path,
}: ReportPageProgress) => {
  const navigate = useNavigate();

  // This determines the type of row based on the number of slashes in the path
  function countSlashes(str: string): number {
    const regex = /\//g;
    const matches = str.match(regex);
    return matches ? matches.length : 0;
  }

  // This is a ternary operator that determines the type of row based on the number of slashes in the path
  const type =
    countSlashes(path) === 3
      ? "child"
      : countSlashes(path) >= 4
      ? "grandchild"
      : "parent";

  return (
    <Tr>
      <Td sx={sx[type]}>{name}</Td>
      <Td sx={sx.status}>
        {!status && status !== undefined && (
          <>
            <Image src={errorIcon} alt="Error" />
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

const sx = {
  parent: {
    fontWeight: "bold",
  },
  child: {
    paddingLeft: "3rem",
  },
  grandchild: {
    paddingLeft: "5rem",
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
