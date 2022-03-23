import { useGetMeasures, useCreateMeasure } from "hooks/api";

export const defaultMockValues = {
  useDeleteMeasuresValues: { mutate: jest.fn() },
  useGetMeasureValues: {
    data: {
      Item: {
        compoundKey: "AL2021ACSAIF-HH",
        coreSet: "ACS",
        createdAt: 1642517935305,
        description: "test description",
        lastAltered: 1642517935305,
        lastAlteredBy: "undefined",
        measure: "AIF-HH",
        state: "AL",
        status: "incomplete",
        year: 2021,
      },
    },
    isLoading: false,
    refetch: jest.fn(),
    isError: false,
    error: undefined,
  },
  useGetMeasuresValues: {
    isLoading: false,
    error: undefined,
    isError: undefined,
    data: {
      Item: [
        {
          compoundKey: "AL2021ACSIET-AD",
          coreSet: "ACS",
          createdAt: 1642167976771,
          description:
            "Initiation and Engagement of Alcohol and Other Drug Abuse or Dependence Treatment",
          lastAltered: 1642167976771,
          measure: "IET-AD",
          state: "AL",
          status: "incomplete",
          year: 2021,
        },
      ],
    },
  },
  useUpdateMeasureValues: {
    useMutation: () => {
      mutate: () => {};
    },
  },
  useCreateMeasureValues: {
    data: {
      Item: {
        compoundKey: "AL2021ACSAIF-HH",
        coreSet: "ACS",
        createdAt: 1642517935305,
        description: "test description",
        lastAltered: 1642517935305,
        lastAlteredBy: "undefined",
        measure: "AIF-HH",
        state: "AL",
        status: "incomplete",
        year: 2021,
      },
    },
    isLoading: false,
    refetch: jest.fn(),
    isError: false,
    error: undefined,
  },
};

export const useApiMock = ({
  useGetMeasuresValues = defaultMockValues.useGetMeasuresValues,
  useCreateMeasureValues = defaultMockValues.useCreateMeasureValues,
}) => {
  (useGetMeasures as jest.Mock).mockReturnValue({
    ...useGetMeasuresValues,
  });
  (useCreateMeasure as jest.Mock).mockReturnValue({
    ...useCreateMeasureValues,
  });
};
