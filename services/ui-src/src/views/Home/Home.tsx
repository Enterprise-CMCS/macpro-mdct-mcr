import { Navigate } from "react-router-dom";
// utils
import { UserRoles, MeasureStatus, CoreSetAbbr } from "libs/types";
import { useUser } from "hooks/authHooks";
import { useCreateMeasure, useGetMeasures, useDeleteMeasure } from "hooks/api";
// components
import { Box, Button, Text } from "@chakra-ui/react";

// TODO: remove temporary variables
const year = "2021";
const state = "AL";
const coreSet = CoreSetAbbr.ACS;

export function Home() {
  const { userRole, userState } = useUser();
  const mutation = useCreateMeasure();
  let { data } = useGetMeasures(state, year, coreSet);
  const deleteMeasureMutation = useDeleteMeasure();
  const isAdminUser = userRole && userRole !== UserRoles.STATE;

  // TODO: remove temporary function
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

  // TODO: remove temporary function
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

  if (isAdminUser) {
    return <Navigate to={`/admin`} />;
  }

  return (
    <section>
      {userState ? (
        <>
          <Button onClick={() => addMeasure()}>Create Measure</Button>
          <h2>Measures:</h2>
          {data?.Items &&
            data.Items.map((item: any): any => (
              <div key={item.compoundKey}>
                <Text>
                  State: {item.state}
                  <br />
                  Year: {item.year}
                  <br />
                  Measure: {item.measure}
                </Text>
                <Button
                  onClick={() => {
                    deleteMeasure(item.measure);
                  }}
                >
                  Delete Measure
                </Button>
              </div>
            ))}
        </>
      ) : (
        <Box data-testid="home-view">
          <Text>You are not authorized to view this page</Text>
        </Box>
      )}
    </section>
  );
}
