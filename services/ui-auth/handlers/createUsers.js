import * as cognitolib from "../libs/cognito-lib.js";
const userPoolId = process.env.userPoolId;
import users from "../libs/users.json" with { type: "json" };

export async function handler(_event, _context, _callback) {
  for (var i = 0; i < users.length; i++) {
    var poolData = {
      UserPoolId: userPoolId,
      Username: users[i].username,
      MessageAction: "SUPPRESS",
      UserAttributes: users[i].attributes,
    };
    var passwordData = {
      Password: process.env.bootstrapUsersPassword,
      UserPoolId: userPoolId,
      Username: users[i].username,
      Permanent: true,
    };
    var attributeData = {
      Username: users[i].username,
      UserPoolId: userPoolId,
      UserAttributes: users[i].attributes,
    };

    try {
      // This may error if the user already exists
      await cognitolib.createUser(poolData);
    } catch {
      /* swallow this exception and continue */
    }

    try {
      //userCreate must set a temp password first, calling setPassword to set the password for consistent dev login
      await cognitolib.setPassword(passwordData);
    } catch {
      /* swallow this exception and continue */
    }

    try {
      //if user exists and attributes are updated in this file updateUserAttributes is needed to update the attributes
      await cognitolib.updateUserAttributes(attributeData);
    } catch {
      /* swallow this exception and continue */
    }
  }
}
