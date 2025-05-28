import { EntityShape } from "types";

/**
 * if an analysis method is being used in a standard and it's not being
 * utilized anymore in the report then the standard should be deleted
 *
 * Loop through the standards array.
 * Find all keys that start with standard_analysisMethodsUtilized-.
 * For each of those keys, extract the last segment (the analysis method id).
 * Compare that id against the list returned from ApplicableIds
 */
export const filterStandardsByUtilizedAnalysisMethods = (
  standards: any[],
  removedAnalysisMethodId: string
): any[] => {
  return standards
    .map((standard) => {
      const utilizedKeys = Object.keys(standard).filter((key) =>
        key.startsWith("standard_analysisMethodsUtilized-")
      );
      let totalUtilized = 0;

      utilizedKeys.forEach((key) => {
        const methods = standard[key];
        const filteredMethods = methods.filter(
          (method: { key: string }) =>
            !method.key.endsWith(removedAnalysisMethodId)
        );
        standard[key] = filteredMethods;
        totalUtilized += filteredMethods.length;
      });

      return totalUtilized > 0 ? standard : null;
    })
    .filter((standard) => standard !== null);
};

/**
 * analysis methods without an applicable plan are removed from
 * associated standards
 * standards without any associated analysis methods are removed
 */

export const filterStandardsAfterPlanDeletion = (
  standards: EntityShape[] = [],
  analysisMethods: EntityShape[] = [],
  remainingPlanIds: string[] = []
): EntityShape[] => {
  // ids of analysis methods that have at least one applicable plan
  const stillUtilizedMethodIds = analysisMethods
    .filter((method) => {
      const isRequiredMethodUltilized =
        method.analysis_applicable?.[0]?.value === "Yes";
      const isCustomMethod = !!method.custom_analysis_method_name;

      const hasRemainingPlans = (
        method.analysis_method_applicable_plans || []
      ).some((plan: { key: string }) => {
        const planId =
          plan.key.split("analysis_method_applicable_plans-").pop() || "";
        return remainingPlanIds.includes(planId);
      });
      return (isRequiredMethodUltilized || isCustomMethod) && hasRemainingPlans;
    })
    .map((method) => method.id);

  return standards
    .map((standard) => {
      const newStandard = { ...standard };
      const utilizedKeys = Object.keys(standard).filter((key) =>
        key.startsWith("standard_analysisMethodsUtilized-")
      );

      let hasUtilizedMethods = false;

      /**
       * only keep standards with a key that matches a utilized method id
       * sets the filterd array back on the cloned standard
       * checks that standard is still valid (has an assoc. analysis method)
       */
      utilizedKeys.forEach((key) => {
        const original = newStandard[key] || [];
        const filtered = original.filter((entry: { key: string }) =>
          stillUtilizedMethodIds.some((id) => entry.key.endsWith(id))
        );
        newStandard[key] = filtered;
        if (filtered.length > 0) hasUtilizedMethods = true;
      });

      return hasUtilizedMethods ? newStandard : null;
    })
    .filter((standard): standard is EntityShape => standard !== null);
};
