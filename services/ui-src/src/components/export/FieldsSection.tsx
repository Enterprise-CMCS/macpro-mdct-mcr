import { Box, Heading } from "@chakra-ui/react";
import { FieldsSubsection } from "components";

const FieldsSection = ({ route }: FieldsSectionProps) => {
  return (
    <Box mt="5rem" key={route.path}>
      <Heading as="h2" sx={sx.sectionHeading}>
        {`Section ${route.name}`}
      </Heading>

      {route.children?.map((child: any) => {
        return <FieldsSubsection key={child.path} content={child} />;
      })}
    </Box>
  );
};

export { FieldsSection };

interface FieldsSectionProps {
  route: any;
}

const sx = {
  sectionHeading: {
    fontWeight: "bold",
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
  },
};
