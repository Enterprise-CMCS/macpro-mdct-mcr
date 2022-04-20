import { Navigate } from "react-router-dom";
// utils
import { UserRoles, MeasureStatus, CoreSetAbbr } from "libs/types";
import { useUser } from "hooks/authHooks";
import { useCreateMeasure, useGetMeasures, useDeleteMeasure } from "hooks/api";
// components
import { Box, Button } from "@chakra-ui/react";
// styling
import "./index.module.scss";

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
        console.log(e); // eslint-disable-line no-console
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
      <Box data-testid="Home-Container">
        You are not authorized to view this page
      </Box>
    );
  }
  return (
    <section>
      <div>
        <Button onClick={() => addMeasure()}>Create Measure</Button>
      </div>
      <h2>Measures:</h2>
      {data?.Items && (
        <div>
          {data.Items.map((item: any): any => (
            <div key={item.compoundKey}>
              <p>
                State: {item.state}, Year: {item.year}, Measure, {item.measure}
              </p>
              <Button
                onClick={() => {
                  deleteMeasure(item.measure);
                }}
              >
                Delete Measure
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
