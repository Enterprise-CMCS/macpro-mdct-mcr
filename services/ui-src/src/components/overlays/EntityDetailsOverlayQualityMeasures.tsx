import { MouseEventHandler, useContext, useState } from "react";
// components
import {
  Box,
  Heading,
  List,
  ListItem,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  DrawerReportPageEntityRows,
  ReportContext,
  ReportDrawer,
  ReportPageIntro,
  SaveReturnButton,
} from "components";
// types
import {
  AnyObject,
  DrawerReportPageShape,
  EntityShape,
  ModalOverlayReportPageShape,
  ReportShape,
  ReportStatus,
} from "types";
// utils
import {
  getMeasureValues,
  getReportVerbiage,
  parseCustomHtml,
  translate,
  useStore,
} from "utils";
// verbiage
import overlayVerbiage from "verbiage/pages/overlays";

const createRateField = (id: string, name: string) => ({
  id: `measure_rate_results_${id}`,
  type: "number",
  validation: "numberOptional",
  props: {
    label: `${name} results`,
    hint: "If you are reporting results for this performance rate for this reporting period, enter a number. Enter “NR” if you are suppressing data for data privacy purposes. Enter “N/A” for all other reasons.",
  },
});

export const EntityDetailsOverlayQualityMeasures = ({
  closeEntityDetailsOverlay,
  report,
  route,
  selectedMeasure,
}: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<EntityShape>();
  const [planMeasureData, setPlanMeasureData] = useState<EntityShape>();
  const [drawerForm, setDrawerForm] = useState(route?.drawerForm);
  const { updateReport } = useContext(ReportContext);
  const { full_name, state, userIsEndUser } = useStore().user ?? {};
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { qualityMeasuresVerbiage } = getReportVerbiage(report.reportType);
  const { tableHeaders } = qualityMeasuresVerbiage;

  const canAddEntities = true;
  const openDeleteEntityModal = () => {};

  const addRatesToForm = () => {
    const copiedDrawerForm = structuredClone(route?.drawerForm);
    const rates = selectedMeasure.measure_rates;
    for (const rate of rates) {
      copiedDrawerForm?.fields.push(createRateField(rate.id, rate.name));
    }
    return copiedDrawerForm;
  };

  const openRowDrawer = (plan: EntityShape) => {
    const drawerFormWithRates = addRatesToForm();
    setDrawerForm(drawerFormWithRates);
    setSelectedPlan(plan);
    setPlanMeasureData(plan?.measures?.[selectedMeasure.id]);
    onOpen();
  };

  const list = Object.keys(tableHeaders).map((key: string) => {
    const values = getMeasureValues(selectedMeasure, key);

    return {
      ariaValues: values.join(" "),
      header: tableHeaders[key],
      values,
    };
  });

  const hasDrawerForm = !!route?.drawerForm;

  const onSubmit = async (enteredData: AnyObject) => {
    if (userIsEndUser) {
      setSubmitting(true);
      const reportKeys = {
        reportType: report?.reportType,
        state: state,
        id: report?.id,
      };

      const currentPlans = [...(report?.fieldData.plans || [])];
      let selectedPlanIndex = currentPlans.findIndex(
        (plan: EntityShape) => plan.id == selectedPlan?.id
      );

      const newPlan = {
        ...selectedPlan,
        measures: {
          ...selectedPlan?.measures,
          [selectedMeasure.id]: {
            ...enteredData,
          },
        },
      };

      const updatedPlans = currentPlans;
      updatedPlans[selectedPlanIndex] = newPlan;

      const dataToWrite = {
        metadata: {
          status: ReportStatus.IN_PROGRESS,
          lastAlteredBy: full_name,
        },
        fieldData: {
          plans: updatedPlans,
        },
      };
      await updateReport(reportKeys, dataToWrite);
      setSubmitting(false);
    }
    setSelectedPlan(undefined);
    onClose();
  };

  return (
    <>
      <ReportPageIntro text={overlayVerbiage.MCPAR.intro} />
      <Heading as="h2" sx={sx.measureName}>
        {selectedMeasure.measure_name}
      </Heading>
      <List sx={sx.list}>
        {list.map((listItem: any, index: number) => (
          <ListItem
            aria-label={`${listItem.header} ${listItem.ariaValues}`}
            key={index}
            sx={sx.listItem}
          >
            <Box sx={sx.listHeader}>{listItem.header}</Box>
            <Box sx={sx.listValues}>
              {listItem.values.map((value: string, index: number) => (
                <Text key={`${listItem.header}-${index}`} sx={sx.listValue}>
                  {value}
                </Text>
              ))}
            </Box>
          </ListItem>
        ))}
      </List>
      <Heading as="h2" sx={sx.reportTitle}>
        {overlayVerbiage.MCPAR.reportTitle}
      </Heading>
      <Text sx={sx.reportSubtitle}>{overlayVerbiage.MCPAR.reportSubtitle}</Text>
      <Heading as="h3" sx={dashboardTitleStyling(canAddEntities)}>
        {parseCustomHtml(overlayVerbiage.MCPAR.dashboardTitle)}
      </Heading>
      <DrawerReportPageEntityRows
        entities={report.fieldData.plans}
        hasForm={hasDrawerForm}
        openRowDrawer={openRowDrawer}
        openDeleteEntityModal={openDeleteEntityModal}
        route={route}
        showStatusText={true}
      />
      <SaveReturnButton
        border={false}
        onClick={closeEntityDetailsOverlay}
        disabledOnClick={closeEntityDetailsOverlay}
      />
      {hasDrawerForm && (
        <ReportDrawer
          selectedEntity={planMeasureData!}
          verbiage={{
            drawerTitle: translate(route.verbiage.drawerTitle, {
              plan: selectedPlan?.name,
              measureName: selectedMeasure.measure_name,
            }),
          }}
          form={drawerForm!}
          onSubmit={onSubmit}
          submitting={submitting}
          drawerDisclosure={{
            isOpen,
            onClose,
          }}
        />
      )}
    </>
  );
};

interface Props {
  closeEntityDetailsOverlay: MouseEventHandler;
  report: ReportShape;
  route: DrawerReportPageShape | ModalOverlayReportPageShape;
  selectedMeasure: EntityShape;
}

function dashboardTitleStyling(canAddEntities: boolean) {
  return {
    borderBottom: "1.5px solid var(--mdct-colors-gray_lighter)",
    color: "gray",
    fontSize: "lg",
    fontWeight: "bold",
    paddingBottom: "0.75rem",
    paddingLeft: canAddEntities && "3.75rem",
  };
}

const sx = {
  list: {
    borderBottom: "1px solid var(--mdct-colors-gray_lighter)",
    paddingBottom: "spacer1",
    marginBottom: "spacer4",
    maxWidth: "608px",
    width: "100%",
  },
  listHeader: {
    fontWeight: "bold",
    marginRight: "spacer3",
    width: "165px",
  },
  listItem: {
    display: "flex",
    fontSize: "sm",
    marginBottom: "spacer2",
  },
  listValues: {
    flex: 1,
  },
  listValue: {
    marginTop: "spacer1",
    "&:first-of-type": {
      marginTop: 0,
    },
  },
  measureName: {
    fontSize: "lg",
    fontWeight: "bold",
    marginBottom: "spacer2",
  },
  reportTitle: {
    fontSize: "xl",
    fontWeight: "bold",
    marginBottom: "spacer2",
  },
  reportSubtitle: {
    fontSize: "md",
    color: "gray",
    marginBottom: "spacer2",
  },
};
