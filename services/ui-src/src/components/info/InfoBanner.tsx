// components
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
} from "@chakra-ui/react";

export const InfoBanner = () => {
  return (
    <Flex sx={sx.infoFlex} data-testid="info-alert">
      <Alert
        sx={sx.info}
        status="info"
        variant="left-accent"
        bg={"palette.alt_lightest"}
        flexWrap="wrap"
      >
        <AlertIcon color={"palette.gray_darkest"} />
        <AlertTitle>Welcome to the new Managed Care Reporting tool!</AlertTitle>
        <AlertDescription marginLeft="2rem">
          Each state must submit one report per program.
        </AlertDescription>
      </Alert>
    </Flex>
  );
};

const sx = {
  infoFlex: {
    marginTop: "1.25rem",
    marginBottom: "2.5rem",
  },
  info: {
    height: "5.25rem",
    borderInlineStartColor: "palette.alt",
    borderInlineStartWidth: "0.5rem",
  },
};
