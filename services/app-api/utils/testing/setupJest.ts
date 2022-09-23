export const mockReportJson = {
  name: "mock-report",
  basePath: "/mock",
  routes: [],
  validationJson: {},
};

export const mockReportKeys = {
  state: "AB",
  id: "mock-report-id",
};

export const mockReportFieldData = {
  text: "text-input",
  number: 0,
  radio: ["option1"],
  checkbox: ["option1", "option2"],
  dropdown: "dropdown-selection",
};

export const mockReport = {
  ...mockReportKeys,
  reportType: "mock-type",
  formTemplate: mockReportJson,
  programName: "testProgram",
  status: "Not started",
  dueDate: 168515200000,
  reportingPeriodStartDate: 162515200000,
  reportingPeriodEndDate: 168515200000,
  createdAt: 162515200000,
  lastAltered: 162515200000,
  lastAlteredBy: "Thelonious States",
  combinedData: "Yes...",
  fieldData: mockReportFieldData,
};
