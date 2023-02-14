const {
  buildClient,
  convertToDynamoExpression,
} = require("../libs/dynamo-lib");

/**
 * Handler for enrollment count events that come across kafka from SEDS
 * The enrollment counts are loaded into a seperate table to be loaded alongside
 * section 2 in CARTS.
 *
 * @param {*} event
 * @param {*} _context
 * @param {*} _callback
 */
async function myHandler(event, _context, _callback) {
  const json = JSON.parse(event.value);
  const currentYear = getReportingYear();
  const dynamoClient = buildClient();

  if (
    json.NewImage.enrollmentCounts &&
    json.NewImage.enrollmentCounts.year >= currentYear - 1 &&
    json.NewImage.quarter === 4
  ) {
    try {
      // eslint-disable-next-line no-console
      console.log("Sink message received", json);
      const indexToUpdate =
        json.NewImage.enrollmentCounts.year === currentYear ? 2 : 1;
      let typeOfEnrollment = "Medicaid Expansion CHIP";
      let typeKey = "medicaid_exp_chip";
      if (json.NewImage.enrollmentCounts.type === "separate") {
        typeOfEnrollment = "Separate CHIP";
        typeKey = "separate_chip";
      }
      const stateId = json.NewImage.state_id;
      const createdTime = new Date().toLocaleString();

      const pk = `${stateId}-${currentYear}`;
      const entryKey = `${typeKey}-${indexToUpdate}`;

      const enrollmentEntry = {
        filterId: `${currentYear}-02`,
        typeOfEnrollment,
        indexToUpdate,
        stateId,
        yearToModify: currentYear,
        enrollmentCount: json.NewImage.enrollmentCounts.count,
        createdTime,
        lastSynced: json.NewImage.lastSynced,
      };

      await updateEnrollment(pk, entryKey, enrollmentEntry, dynamoClient);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
}

const updateEnrollment = async (pk, entryKey, enrollmentData, dynamoClient) => {
  const params = {
    TableName: process.env.stageEnrollmentCountsTableName,
    Key: {
      pk: pk,
      entryKey: entryKey,
    },
    ...convertToDynamoExpression(enrollmentData),
  };
  await dynamoClient.update(params).promise();
};

/**
 * SEDS Data is reported for Q4 (July 1 - Sep 30) starting on Oct 1
 * Forms are not available to SEDS users before that date.
 *
 * @returns fiscalYear
 */
const getReportingYear = () => {
  const today = new Date();
  const month = today.getMonth() + 1;

  let fiscalyear = today.getFullYear();
  if (month < 10) fiscalyear -= 1;
  return fiscalyear;
};

exports.handler = myHandler;
