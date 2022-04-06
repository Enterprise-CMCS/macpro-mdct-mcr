import { Navigate } from "react-router-dom";
import { UserRoles } from "types";
import * as CUI from "@chakra-ui/react";
import "./index.module.scss";
import { useUser } from "hooks/authHooks";
import { useCreateMeasure, useGetMeasures, useDeleteMeasure } from "hooks/api";
import { MeasureStatus, CoreSetAbbr } from "types";

export function Home() {
  const { userRole, userState } = useUser();
  const coreSet = CoreSetAbbr.ACS;
  const year = "2021";
  const state = "AL";
  const mutation = useCreateMeasure();
  let { data } = useGetMeasures(state, year, coreSet);
  const deleteMeasureMutation = useDeleteMeasure();

  if (
    userRole === UserRoles.HELP ||
    userRole === UserRoles.ADMIN ||
    userRole === UserRoles.BO ||
    userRole === UserRoles.BOR
  ) {
    return <Navigate to={`/admin`} />;
  }

  const addMeasure = () => {
    const measure = {
      coreSet: coreSet,
      status: MeasureStatus.INCOMPLETE,
      measure: "AIF-HH",
      state: state,
      year: year,
      data: {
        userState,
        userRole,
        description: "test description",
      },
    };
    mutation.mutate(measure, {
      onSuccess: () => {
        window.location.reload();
      },
      onError: (e) => {
        console.log(e);
      },
    });
  };

  const deleteMeasure = (measure: string) => {
    deleteMeasureMutation.mutate(
      { state, year, coreSet, measure },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  if (!userState) {
    return (
      <CUI.Box data-testid="Home-Container">
        You are not authorized to view this page
      </CUI.Box>
    );
  }
  return (
    <section>
      <div>
        <CUI.Button onClick={() => addMeasure()}>Create Measure</CUI.Button>
      </div>
      <h2>Measures:</h2>
      {data?.Items && (
        <div>
          {data.Items.map((item: any): any => (
            <div key={item.compoundKey}>
              <p>
                State: {item.state}, Year: {item.year}, Measure, {item.measure}
              </p>
              <CUI.Button
                onClick={() => {
                  deleteMeasure(item.measure);
                }}
              >
                Delete Measure
              </CUI.Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
