import { useContext, useState } from "react";
// components
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { ReportContext, ReportDrawer } from "components";
// utils
import { useUser } from "utils";
import {
  AnyObject,
  FormJson,
  ReportDataShape,
  ReportStatus,
  UserRoles,
} from "types";

export const StaticDrawerSection = ({ form, drawer }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { report, updateReportData, updateReport } = useContext(ReportContext);

  // make state
  const [currentEntity, setCurrentEntity] = useState<string>("");

  // get user state, name, role
  const { user } = useUser();
  const { full_name, state, userRole } = user ?? {};

  // get state and reportId from context or storage
  const reportId = report?.reportId || localStorage.getItem("selectedReport");
  const reportState = state || localStorage.getItem("selectedState");

  const openRowDrawer = (entity: string) => {
    setCurrentEntity(entity);
    onOpen();
  };

  const tempEntityMap = {
    plans: ["Plan A", "Plan B", "Plan C"],
  };

  const onSubmit = async (formData: ReportDataShape) => {
    if (userRole === UserRoles.STATE_USER || userRole === UserRoles.STATE_REP) {
      const reportKeys = {
        state: reportState,
        reportId: reportId,
      };
      const reportMetadata = {
        status: ReportStatus.IN_PROGRESS,
        lastAlteredBy: full_name,
      };
      await updateReportData(reportKeys, formData);
      await updateReport(reportKeys, reportMetadata);
    }
  };

  return (
    <Box data-testid="static-drawer-section">
      <Heading as="h4">{drawer.dashboard.title}</Heading>
      {tempEntityMap.plans.map((entity) => {
        return (
          <Flex key={entity} sx={sx.entityRow}>
            <Heading as="h5">{entity}</Heading>
            <Button
              sx={sx.enterButton}
              onClick={() => openRowDrawer(entity)}
              variant="outline"
            >
              Enter
            </Button>
          </Flex>
        );
      })}
      <ReportDrawer
        drawerDisclosure={{
          isOpen,
          onClose,
        }}
        drawerTitle={`${drawer.drawerTitle} ${currentEntity}`}
        drawerInfo={drawer.drawerInfo}
        form={form}
        onSubmit={onSubmit}
        data-testid="report-drawer"
      />
    </Box>
  );
};

interface Props {
  form: FormJson;
  drawer: AnyObject;
}

const sx = {
  entityRow: {
    justifyContent: "space-between",
    alignItems: "center",
    height: "3.25rem",
    padding: "0.5rem",
    paddingLeft: "0.75rem",
    borderBottom: "1.5px solid var(--chakra-colors-palette-gray_lighter)",
  },
  enterButton: {
    width: "4.25rem",
    height: "1.75rem",
    fontSize: "md",
    fontWeight: "normal",
  },
};
