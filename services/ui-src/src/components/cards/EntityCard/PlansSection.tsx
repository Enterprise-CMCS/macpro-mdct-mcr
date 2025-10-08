import { Box, Text } from "@chakra-ui/react";
import { AnyObject, SxObject } from "types";

export const PlansSection = ({ formattedEntityData, sx }: Props) => (
  <>
    <Text sx={sx.planHeading}>{formattedEntityData.heading}</Text>
    {formattedEntityData?.questions?.map((q: AnyObject) => {
      const answers = Array.isArray(q.answer) ? q.answer : [q.answer];
      return (
        <Box key={`${q.question} ${q.answer}`}>
          <Text sx={sx.subtitle}>{q.question}</Text>
          {answers.map((answer) => (
            <Text key={`${q.question} ${answer}`} sx={sx.subtext}>
              {answer}
            </Text>
          ))}
        </Box>
      );
    })}
  </>
);

interface Props {
  formattedEntityData: any;
  sx: SxObject;
  topSection?: boolean;
  bottomSection?: boolean;
}
