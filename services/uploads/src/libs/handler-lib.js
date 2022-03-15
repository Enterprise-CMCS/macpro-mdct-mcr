const { success, failure } = require("./response-lib");

function handler(lambda) {
  return async function (event, context) {
    try {
      // Run the Lambda
      const body = await lambda(event, context);
      return success(body);
    } catch (e) {
      const body = { error: e.message };
      return failure(body);
    }
  };
}

module.exports = { handler: handler };
