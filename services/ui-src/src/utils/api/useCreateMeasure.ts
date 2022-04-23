import { useMutation } from "react-query";
import { createMeasure } from "utils/api/requestMethods";
import { CoreSetAbbr, Params, MeasureStatus } from "utils/types/types";

interface CreateMeasure<DataType = any> {
  coreSet?: CoreSetAbbr;
  data: DataType;
  measure?: string;
  status: MeasureStatus;
  reporting?: string | undefined;
  state: string;
  year: string;
}

const createNewMeasure = ({
  state,
  year,
  coreSet,
  status,
  reporting,
  data,
  measure,
}: CreateMeasure & Params) => {
  return createMeasure({
    state,
    year,
    coreSet,
    measure,
    body: {
      data,
      reporting,
      status,
    },
  });
};

export const useCreateMeasure = () => {
  {
    return useMutation((data: CreateMeasure) =>
      createNewMeasure({
        measure: data.measure,
        ...data,
      })
    );
  }
};
