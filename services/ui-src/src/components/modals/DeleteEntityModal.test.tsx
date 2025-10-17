import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { DeleteEntityModal, ReportContext } from "components";
// constants
import { planComplianceStandardKey } from "../../constants";
// utils
import {
  mockModalDrawerReportPageVerbiage,
  mockMcparReport,
  mockMcparReportContext,
  mockReportKeys,
  mockAccessMeasuresEntity,
  mockStateUserStore,
  mockMcparReportStore,
  mockNaaarStandards,
  mockNaaarReportStore,
  mockNaaarReportContext,
  mockNaaarReport,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";
import { EntityType } from "types";

jest.mock("react-uuid", () => jest.fn(() => "mock-id-2"));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockMcparReportStore,
});

const mockUpdateReport = jest.fn();
const mockCloseHandler = jest.fn();

const mockedReportContext = {
  ...mockMcparReportContext,
  updateReport: mockUpdateReport,
  report: {
    ...mockMcparReport,
    fieldData: {
      accessMeasures: [mockAccessMeasuresEntity],
    },
  },
};

const mockUpdateCallBaseline = {
  fieldData: mockedReportContext.report.fieldData,
  metadata: {
    lastAlteredBy: "Thelonious States",
    status: "In progress",
  },
};

const mockBadReportContext = {
  ...mockMcparReportContext,
  updateReport: mockUpdateReport,
  report: {
    ...mockMcparReport,
    fieldData: {},
  },
};

const mockBadUpdateCallBaseline = {
  fieldData: mockBadReportContext.report.fieldData,
  metadata: {
    lastAlteredBy: "Thelonious States",
    status: "In progress",
  },
};

const mockDeletedEntityStore = {
  ...mockMcparReportStore,
  ...(mockMcparReportStore.report!.fieldData = {
    accessMeasures: [],
  }),
};

const modalComponent = (
  <ReportContext.Provider value={mockedReportContext}>
    <DeleteEntityModal
      entityType={EntityType.ACCESS_MEASURES}
      selectedEntity={mockAccessMeasuresEntity}
      verbiage={mockModalDrawerReportPageVerbiage}
      modalDisclosure={{
        isOpen: true,
        onClose: mockCloseHandler,
      }}
    />
  </ReportContext.Provider>
);

const { deleteModalTitle, deleteModalConfirmButtonText } =
  mockModalDrawerReportPageVerbiage;

describe("<DeleteEntityModal />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("Test DeleteEntityModal", () => {
    beforeEach(async () => {
      await act(async () => {
        await render(modalComponent);
      });
    });

    test("DeleteEntityModal shows the contents", () => {
      expect(screen.getByText(deleteModalTitle)).toBeTruthy();
      expect(screen.getByText(deleteModalConfirmButtonText)).toBeTruthy();
      expect(screen.getByText("Cancel")).toBeTruthy();
    });

    test("DeleteEntityModal top close button can be clicked", () => {
      fireEvent.click(screen.getByText("Close"));
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });

    test("DeleteEntityModal bottom cancel button can be clicked", () => {
      fireEvent.click(screen.getByText("Cancel"));
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("Test DeleteEntityModal functionality", () => {
    test("DeleteEntityModal deletes entity when deletion confirmed", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockDeletedEntityStore,
      });

      await act(async () => {
        await render(modalComponent);
      });

      const submitButton = screen.getByText(deleteModalConfirmButtonText);
      await act(async () => {
        await userEvent.click(submitButton);
      });

      const mockUpdateCallPayload = mockUpdateCallBaseline;
      mockUpdateCallPayload.fieldData.accessMeasures = [];

      await expect(mockUpdateReport).toHaveBeenCalledWith(
        mockReportKeys,
        mockUpdateCallPayload
      );
      await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });

    test("DeleteEntityModal delete handles empty fielddata", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockDeletedEntityStore,
      });

      await act(async () => {
        await render(modalComponent);
      });

      const submitButton = screen.getByText(deleteModalConfirmButtonText);
      await act(async () => {
        await userEvent.click(submitButton);
      });

      const mockUpdateCallPayload = mockBadUpdateCallBaseline;
      mockUpdateCallPayload.fieldData = { accessMeasures: [] };

      await expect(mockUpdateReport).toHaveBeenCalledWith(
        mockReportKeys,
        mockUpdateCallPayload
      );
      await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("Test NAAAR deletion cases", () => {
    const naaarMockPlan = {
      id: "mockPlanId",
      [`${planComplianceStandardKey}-${mockNaaarStandards[0].id}`]:
        "Remove Value",
      [`${planComplianceStandardKey}-otherId`]: "Keep Value",
    };

    const naaarMockedReportContext = {
      ...mockNaaarReportContext,
      updateReport: mockUpdateReport,
      report: {
        ...mockNaaarReport,
        fieldData: {
          standards: mockNaaarStandards,
          plans: [naaarMockPlan],
        },
      },
    };

    const naaarMockUpdateCallBaseline = {
      fieldData: naaarMockedReportContext.report.fieldData,
      metadata: {
        lastAlteredBy: "Thelonious States",
        status: "In progress",
      },
    };

    const naaarMockDeletedEntityStore = {
      ...mockNaaarReportStore,
      ...(mockNaaarReportStore.report!.fieldData = {
        standards: mockNaaarStandards,
        plans: [naaarMockPlan],
      }),
    };

    const naaarMockReportKeys = {
      ...mockReportKeys,
      reportType: "NAAAR",
    };

    const naaarModalComponent = (
      <ReportContext.Provider value={naaarMockedReportContext}>
        <DeleteEntityModal
          entityType={EntityType.STANDARDS}
          selectedEntity={mockNaaarStandards[0]}
          verbiage={mockModalDrawerReportPageVerbiage}
          modalDisclosure={{
            isOpen: true,
            onClose: mockCloseHandler,
          }}
        />
      </ReportContext.Provider>
    );

    test("handles deleting standards and standards in plans", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...naaarMockDeletedEntityStore,
      });

      render(naaarModalComponent);

      const submitButton = screen.getByText(deleteModalConfirmButtonText);
      await act(async () => {
        await userEvent.click(submitButton);
      });

      const mockUpdateCallPayload = naaarMockUpdateCallBaseline;
      mockUpdateCallPayload.fieldData.standards = [];
      mockUpdateCallPayload.fieldData.plans = [
        {
          id: "mockPlanId",
          [`${planComplianceStandardKey}-otherId`]: "Keep Value",
        },
      ];

      expect(mockUpdateReport).toHaveBeenCalledWith(
        naaarMockReportKeys,
        mockUpdateCallPayload
      );
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("Test NAAAR custom analysis method deletion", () => {
    test("handles deleting a custom analysis method and filters standards", async () => {
      const mockCustomAnalysisMethodId = "mockCustomAnalysisMethodId";

      const mockStandard = {
        id: "mockStandard",
        [`standard_analysisMethodsUtilized-mockStandard`]: [
          {
            key: `standard_analysisMethodsUtilized-mockStandard-${mockCustomAnalysisMethodId}`,
            value: "Custom Method A",
          },
        ],
      };

      const naaarMockedCustomReportContext = {
        ...mockNaaarReportContext,
        updateReport: mockUpdateReport,
        report: {
          ...mockNaaarReport,
          fieldData: {
            standards: [mockStandard],
            analysisMethods: [
              {
                id: mockCustomAnalysisMethodId,
                name: "Custom Method A",
              },
            ],
            plans: [
              {
                id: "mockPlanId",
              },
            ],
          },
        },
      };

      const naaarCustomMockDeletedEntityStore = {
        ...mockNaaarReportStore,
        ...(mockNaaarReportStore.report!.fieldData = {
          standards: [mockStandard],
          analysisMethods: [],
          plans: [
            {
              id: "mockPlanId",
            },
          ],
        }),
      };

      const naaarMockReportKeys = {
        ...mockReportKeys,
        reportType: "NAAAR",
      };

      const naaarCustomModalComponent = (
        <ReportContext.Provider value={naaarMockedCustomReportContext}>
          <DeleteEntityModal
            entityType={EntityType.ANALYSIS_METHODS}
            selectedEntity={{
              id: mockCustomAnalysisMethodId,
              name: "Custom Method A",
            }}
            verbiage={mockModalDrawerReportPageVerbiage}
            modalDisclosure={{
              isOpen: true,
              onClose: mockCloseHandler,
            }}
          />
        </ReportContext.Provider>
      );

      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...naaarCustomMockDeletedEntityStore,
      });

      render(naaarCustomModalComponent);

      const submitButton = screen.getByText(deleteModalConfirmButtonText);
      await act(async () => {
        await userEvent.click(submitButton);
      });

      const expectedUpdatePayload = {
        fieldData: {
          standards: [],
          analysisMethods: [],
        },
        metadata: {
          lastAlteredBy: "Thelonious States",
          status: "In progress",
        },
      };

      expect(mockUpdateReport).toHaveBeenCalledWith(
        naaarMockReportKeys,
        expectedUpdatePayload
      );
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });
  });

  testA11yAct(modalComponent);
});
