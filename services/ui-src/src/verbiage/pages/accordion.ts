export default {
  MLR: {
    adminDashboard: {
      buttonLabel: "Instructions",
      intro:
        '<b>State User Instructions</b><br/><br/>As described at <a href="https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-B/section-438.74" target="_blank" aria-label="Link opens in new tab">42 CFR § 438.74</a>, states are required to report summary Medical Loss Ratio (MLR) reports to the Centers for Medicare & Medicaid Services (CMS). The summary MLR report submission coincides with the state’s submission of the annual base rate certification. The summary reports are based on the plans’ annual MLR reports to the state required under <a href="https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(k)" target="_blank" aria-label="Link opens in new tab">42 CFR § 438.8(k)</a>. If the state needs to revise MLR reports previously submitted using the online form, ask your CMS contact to reopen the related submission, which will change it to an “In revision” status. If the state needs to revise MLR reports previously submitted using the Excel Workbook or other format, reach out to your CMS contact to discuss next steps. <a href="https://www.medicaid.gov/medicaid/managed-care/guidance/medicaid-and-chip-managed-care-reporting/index.html#MLR" target="_blank" aria-label="Link opens in new tab">Learn more</a>. <br/> <br/> <b>CMS Admin Instructions</b>',
      list: [
        `To allow a state to make corrections or edits to a submission use "Unlock" to release the submission. The status will change to "In revision".`,
        "Submission count is shown in the # column. Submissions started and submitted once have a count of 1. When a state resubmits a previous submission, the count increases by 1.",
        `To archive a submission and hide it from a state's dashboard, use "Archive".`,
      ],
      text: "",
    },
    stateUserDashboard: {
      buttonLabel: "Instructions",
      intro:
        'As described at <a href="https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-B/section-438.74" target="_blank" aria-label="Link opens in new tab">42 CFR § 438.74</a>, states are required to report summary Medical Loss Ratio (MLR) reports to the Centers for Medicare & Medicaid Services (CMS). The summary MLR report submission coincides with the state’s submission of the annual base rate certification. The summary reports are based on the plans’ annual MLR reports to the state required under <a href="https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(k)" target="_blank" aria-label="Link opens in new tab">42 CFR § 438.8(k)</a>. If the state needs to revise MLR reports previously submitted using the online form, ask your CMS contact to reopen the related submission, which will change it to an “In revision” status. If the state needs to revise MLR reports previously submitted using the Excel Workbook or other format, reach out to your CMS contact to discuss next steps. <a href="https://www.medicaid.gov/medicaid/managed-care/guidance/medicaid-and-chip-managed-care-reporting/index.html#MLR" target="_blank" aria-label="Link opens in new tab">Learn more</a>.',
      list: [],
      text: "",
    },
    formIntro: {
      buttonLabel: "Instructions",
      intro:
        'States must provide summary MLR report data at the plan level. The summary reports are based on the plans\' annual MLR reports tot he state under <a href="https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(k)" target="_blank" aria-label="Link opens in new tab">42 CFR 438.8(k)</a>. States have the option of reporting these data for eac plan by program, statewide, or at another level of aggregation (e.g., eligibility groups). Program is defined by a specified set of benefits and elegibility criteria that are articulated in a contract between the state and managed care plans. <b>MLR data should not be aggregated across multiple plans or across multiple programs; however there is an exception if a managed care plan has more than one contract with the state — the state can report results for each contract separately or combine results for each plan.</b> If a state combines the reporting for plans with multiple contracts, the report must use a consistent MLR reporting year.',
      list: [
        "States providing <b>plan-level MLR results by program</b> should create individual entries for each set of results.",
        "States providing <b>one set of combined plan-level MLR results across programs</b> should create individual entries for each managed care plan.",
        "States reporting <b>MLR calculations for specific eligibility group(s)</b> must separately create individual entries for each respective set of results (e.g. specific MLR results for each eligibility group by program by plan, or specific MLR results for each eligibility group by plan across programs).",
      ],
      text: 'States must report credible and non-credible MLRs for all MCOs, PIHPs, and PAHPs. Under <a href="https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(l)" target="_blank" aria-label="Link opens in new tab">42 CFR 438.8(l)</a> a state may exclude a plan that is newly contracted with the state that is reporting for the first year of the plan\'s operation. These "new experience" plans must report MLRs during the next MLR reporting year in which the plan is in business with the state, even if the first year was not a full 12 months.',
    },
    detailIntro: {
      buttonLabel: "Instructions",
      intro:
        "<p>States must report the five required MLR summary elements. Note that the form fields do not automatically calculate the MLR numerator, denominator, or MLR percentage. Each element must be entered manually. Fields marked as “optional” are included to allow states to report additional MLR data that states currently collect from MCOs, PIHPs, or PAHPs. </p> <br /> <p>Note: States that are reporting non-credible plans should enter member month values in section 3.1 as described below. States should report all other required MLR reporting elements (sections 1.3, 2.3, 3.4) with the value 0, and answer “No” for section 4.1 when reporting non-credible plan information. Reporting in this way will ensure that the progress indicators result in a “complete” status. Information on non-credible plans and credibility adjustment calculations is available from <a href='https://www.medicaid.gov/federal-policy-guidance/downloads/cib073117.pdf' target='_blank' aria-label='Link opens in new tab'>CMCS Informational Bulletin dated July 31, 2017</a>.</p>",
      list: [],
      text: "",
    },
  },
};
