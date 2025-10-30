import { Text, Flex, Heading } from "@chakra-ui/react";
import { componentDefinitions, ComponentTypes } from "./component-definitions";
import React, { ReactNode } from "react";

const componentDefinition = ({
  type,
  description,
  variants,
  display,
}: {
  type: ComponentTypes;
  description: string;
  variants: ReactNode[];
  display?: "inline" | "block";
}) => {
  if (variants.length === 0) return null;
  return (
    <Flex flexDirection="column" sx={sx.componentContainer} key={type}>
      <Heading as="h2">{type}</Heading>
      <Text>{description}</Text>
      <Flex
        sx={
          display === "block" ? sx.variantContainer : sx.variantContainerInline
        }
      >
        {variants.map((variant, index) => (
          <React.Fragment key={`${type}-variant-${index}`}>
            {variant}
          </React.Fragment>
        ))}
      </Flex>
    </Flex>
  );
};

export const ComponentInventoryPage = () => {
  return (
    <Flex flexDirection="column" sx={sx.pageContainer}>
      {componentDefinitions.map(({ type, description, variants, display }) =>
        componentDefinition({ type, description, variants, display })
      )}
    </Flex>
  );
};

const sx = {
  pageContainer: {
    maxWidth: "100%",
    padding: "3rem 0",
  },
  componentContainer: {
    width: "100%",
    paddingBottom: "spacer4",
    "& + &": {
      borderTop: "1px solid",
      borderColor: "gray_lighter",
      paddingTop: "spacer4",
    },
  },
  variantContainer: {
    gap: "spacer2",
    marginTop: "spacer1",
    flexDirection: "column",
    width: "100%",
  },
  variantContainerInline: {
    gap: "spacer2",
    marginTop: "spacer1",
    flexDirection: "row",
  },
};
