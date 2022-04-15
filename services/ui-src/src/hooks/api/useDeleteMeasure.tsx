import { useMutation } from "react-query";
import * as Api from "libs/api";
import { CoreSetAbbr } from "libs/types";

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
