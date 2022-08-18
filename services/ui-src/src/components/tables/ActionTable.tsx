// components
import {
  Table as TableRoot,
  TableCaption,
  Tbody,
  Th,
  Thead,
  Tr,
  VisuallyHidden,
} from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "utils";
import { AnyObject, ActionTableContentShape } from "types";
import { ReactChild } from "react";

/*
 * This was a component I was experimenting with to see how we could add dynamic buttons to the table going forward.
 * Turns out, the simpliest answer was to simply take the Table component we've already created and just make the rows
 * what ever the parent has passed down. For example: The dashboard component I wrote will pass down each row in the table
 * which will let us customize how that row looks for that specific case. It also allows for any complex logic to stay
 * in the parent. All the cases that design has put forward for tables vary slightly but its the rows themselves that change
 * I've kept this component here instead of replacing the Table component completely because of the 'Buttons aren't allowed
 * in tables' problem and I wasn't able to get to that fix.
 */

export const ActionTable = ({
  content,
  children,
  variant,
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();
  return (
    <TableRoot
      variant={variant}
      size="sm"
      sx={{ ...sx.root, ...sxOverride }}
      {...props}
    >
      <TableCaption placement="top" sx={sx.captionBox}>
        <VisuallyHidden>{content.caption}</VisuallyHidden>
      </TableCaption>
      {content.headRow && (
        <Thead>
          {/* Head Row */}
          <Tr>
            {content.headRow.map((headerCell: string, index: number) => (
              <Th
                key={index}
                scope="col"
                sx={sx.tableHeader}
                className={mqClasses}
              >
                {headerCell}
              </Th>
            ))}
          </Tr>
        </Thead>
      )}
      <Tbody>{children}</Tbody>
    </TableRoot>
  );
};

interface Props {
  content: ActionTableContentShape;
  children: ReactChild | ReactChild[];
  variant?: string;
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  root: {
    width: "100%",
  },
  captionBox: {
    margin: 0,
    padding: 0,
    height: 0,
  },
  tableHeader: {
    padding: "0.75rem 0.5rem",
    fontSize: "sm",
    fontWeight: "semibold",
    textTransform: "none",
    letterSpacing: "normal",
    color: "black",
    "&.mobile": {
      fontSize: "xs",
    },
  },
  tableCell: {
    padding: "0.75rem 0.5rem",
    borderStyle: "none",
    fontWeight: "normal",
    color: "black",
    "&.mobile": {
      fontSize: "xs",
    },
  },
};
