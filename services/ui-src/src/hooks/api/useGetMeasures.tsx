import { useQuery } from "react-query";
import { listMeasures } from "libs/api";
import { CoreSetAbbr } from "types";

interface GetMeasures {
  state: string;
  year: string;
  coreSet: string;
}

const getMeasures = async ({ state, year, coreSet }: GetMeasures) => {
  return await listMeasures({
    state,
    year,
    coreSet,
  });
};

export const useGetMeasures = (state: string, year: string, coreSetId: CoreSetAbbr) => {

  return useQuery(["coreSets", state, year], () =>
    getMeasures({
      state: state,
      year: year,
      coreSet: coreSetId
    })
  );
};
