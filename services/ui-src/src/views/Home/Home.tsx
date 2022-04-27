import { Navigate } from "react-router-dom";
// utils
import { UserRoles, MeasureStatus, CoreSetAbbr } from "utils/types/types";
import { useUser } from "utils/auth";
import { useCreateMeasure, useGetMeasures, useDeleteMeasure } from "utils/api";
// components
import { Box, Button, Text } from "@chakra-ui/react";

// TODO: remove temporary variables
const year = "2021";
const state = "AL";
const coreSet = CoreSetAbbr.ACS;

export default () => {
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
      <Text as="h1" my="1rem">
        Managed Care Reporting
      </Text>
      <Text as="h2" my="1rem">
        Manage Measures
      </Text>
      {userState ? (
        <Box mt="1rem">
          <Button sx={sx.button} onClick={addMeasure}>
            Create Measure
          </Button>
          {data?.Items &&
            data.Items.map((item: any): any => (
              <Box m="1rem" key={item.compoundKey}>
                <Text my="1rem">
                  State: {item.state}
                  <br />
                  Year: {item.year}
                  <br />
                  Measure: {item.measure}
                </Text>
                <Button
                  sx={sx.button}
                  onClick={() => {
                    deleteMeasure(item.measure);
                  }}
                >
                  Delete Measure
                </Button>
              </Box>
            ))}
        </Box>
      ) : (
        <Box data-testid="home-view">
          <Text>You are not authorized to view this page</Text>
        </Box>
      )}
    </section>
  );
};

const sx = {
  button: {
    color: "palette.white",
    background: "palette.main_darkest",
    _hover: { background: "palette.main_darker" },
  },
};
