import { Button, Image, Td, Tr } from "@chakra-ui/react";
import editIcon from "assets/icons/icon_edit.png";
import errorIcon from "assets/icons/icon_error_circle.png";
import successIcon from "assets/icons/icon_check_circle.png";

export const TableRow = ({
  name,
  children,
  type,
  status,
}: {
  name: string;
  children?: any[];
  status?: "error" | "success";
  type: "parent" | "child" | "grandchild";
}) => {
  return (
    <Tr sx={sx.row}>
      <Td sx={sx[type]}>{name}</Td>
      <Td sx={sx.status}>
        {status === "error" && (
          <>
            <Image src={errorIcon} alt="Error" />
            Error
          </>
        )}
        {status === "success" && (
          <>
            <Image src={successIcon} alt="Error" />
            Success
          </>
        )}
      </Td>
      <Td>
        {!children && (
          <Button sx={sx.enterButton} variant="outline">
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
  row: {
    td: {
      "&:nth-child(1)": {
        width: "50%",
      },
      "&:nth-child(2)": {
        width: "40%",
      },
      "&:nth-child(3)": {
        width: "10%",
      },
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
