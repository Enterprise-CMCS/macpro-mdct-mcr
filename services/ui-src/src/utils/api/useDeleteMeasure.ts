import { useMutation } from "react-query";
import * as Api from "utils/api/requestMethods";
import { CoreSetAbbr } from "utils/types/types";

interface DeleteMeasure {
  state: string;
  year: string;
  coreSet: CoreSetAbbr;
  measure: string;
}

const deleteMeasure = async ({
  state,
  year,
  coreSet,
  measure,
}: DeleteMeasure) => {
  return await Api.deleteMeasure({
    state,
    year,
    coreSet,
    measure,
  });
};

export const useDeleteMeasure = () => {
  return useMutation((data: DeleteMeasure) => deleteMeasure(data));
};
