const fs = require('fs');
const JiraClient = require('jira-client');
const rp = require('request-promise');
const fetch = require('node-fetch');
const base64 = Buffer.from(`${process.env.JIRA_USERNAME}:${process.env.JIRA_API_TOKEN}`).toString('base64');


console.log("JIRA_BASE_URL:", process.env.JIRA_BASE_URL);

const jira = new JiraClient({
  protocol: 'https',
  host: process.env.JIRA_BASE_URL,
  username: process.env.JIRA_USER_EMAIL,
  password: process.env.JIRA_API_TOKEN,
  apiVersion: '2',
  strictSSL: true,
});


function parseSnykOutput(inputData) {
  let vulnerabilities = [];
 
  console.log(inputData);

  if (inputData) {
    try {
      const data = JSON.parse(inputData);
      for (const project of data) {
        vulnerabilities = vulnerabilities.concat(project.vulnerabilities);
      }

      console.log(vulnerabilities);

    } catch (error) {
      console.error('Error parsing Snyk output:', error);
      vulnerabilities = parseNonJsonData(inputData);
    }
  }

  return vulnerabilities;
}


function parseNonJsonData(inputData) {
  let vulnerabilities = [];

  // Custom logic to parse non-JSON inputData
  const defaultTitle = 'Vulnerability Detected';

  vulnerabilities.push({
    title: defaultTitle,
    description: `Non-JSON output from Snyk:\n\n${inputData}`
  });

  return vulnerabilities;
}

async function getEpicLinkCustomFieldId(projectKey) {
  //const url = `https://${process.env.JIRA_BASE_URL}/rest/api/2/issue/createmeta?projectKeys=${projectKey}&expand=projects.issuetypes.fields`;
  //const url = `https://${process.env.JIRA_BASE_URL}/rest/api/2/issue/createmeta`;
  const url = `https://${process.env.JIRA_BASE_URL}/rest/api/2/app/field/MDCT-2280/context/configuration`; 
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${base64}`,
      'Accept': 'application/json'
    }
  });
  
  const data = await response.json();
  console.log(data)
  // console.log(data.projects[0])
  // const issueTypes = data.projects[0].issuetypes;
  // const epicIssueType = issueTypes.find(issueType => issueType.name.toLowerCase() === 'epic');

  // if (!epicIssueType) {
  //   throw new Error(`Epic issue type not found in project: ${projectKey}`);
  // }

  // // Find 'Epic Link' field
  // const epicLinkField = Object.entries(epicIssueType.fields).find(([fieldId, fieldData]) => fieldData.name === 'Epic Link');

  // if (!epicLinkField) {
  //   throw new Error(`Epic Link field not found in Epic issue type for project: ${projectKey}`);
  // }

  // Return the field ID
  //return epicLinkField[0];
  return data;
}





async function createJiraTicket(vulnerability) {
  // projKey = 'MDCT-2280'
  // const test = getEpicLinkCustomFieldId(projectKey)
  // console.log(test)

   // DEFAULT DAYS  set to 60 adjust as needed
   const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  //const today = new Date().toISOString().split('T')[0];

  // JQL query to check ticket given title from the past given days
  let jqlQuery = `project = "${process.env.JIRA_PROJECT_KEY}" AND summary ~ "MCR - ${vulnerability.title}" AND created >= ${sixtyDaysAgo}`;
  let searchResult = await jira.searchJira(jqlQuery);


  if (searchResult.issues && searchResult.issues.length > 0) {
    for (const issue of searchResult.issues) {
      if (issue.fields.status.name !== "Closed" && issue.fields.status.name !== "Cancelled") {
        if (issue.fields.summary.startsWith('[MCR] -')) {
          console.log(`Active Jira ticket already exists for vulnerability: ${vulnerability.title}`);
          return;
        }
      }
      
    }
  } else {
          // get epic custom field id 
          epicKey = process.env.JIRA_EPIC_KEY
          projKey  = process.env.JIRA_PROJECT_KEY

          // const epicLinkField = await getEpicLinkCustomFieldId(projKey)
          //   .then(console.log)
          //   .catch(console.error);
          epicLinkField = 'customfield_10006'
          if(epicLinkField) {
                const issue = {
                    fields: {
                      project: {
                        key: process.env.JIRA_PROJECT_KEY,
                      },
                      summary: `${process.env.JIRA_TITLE_PREFIX}  ${vulnerability.title}`,
                      description: vulnerability.description,
                      issuetype: {
                        name: process.env.JIRA_ISSUE_TYPE,

                      },
                      labels: process.env.JIRA_LABELS.split(','),
                      "customfield_10008" : epicKey,
                    },
                  };

                  let issueResponse;

                  try {
                    const jiraUrl = `${process.env.JIRA_BASE_URL}/rest/api/2/issue`;
                    console.log('JIRA_URL:', jiraUrl);
                    issueResponse = await jira.addNewIssue(issue);
                    console.log(issueResponse)
                    console.log(`Jira ticket created for vulnerability: ${vulnerability.title}`);
                  } catch (error) {
                    console.error('Error creating Jira ticket:', error);
                  }

                  // attach the scan report to the Jira ticket
                  const attachmentUrl = `https://${process.env.JIRA_BASE_URL}/rest/api/2/issue/${issueResponse.key}/attachments`;
                  const attachment = {
                    method: 'POST',
                    uri: attachmentUrl,
                    auth: {
                      username: process.env.JIRA_USER_EMAIL,
                      password: process.env.JIRA_API_TOKEN
                    },

                    headers: {
                      'X-Atlassian-Token': 'no-check', // Disable XSRF check for file upload
                      'X-Requested-With': 'XMLHttpRequest',
                      'X-Scheme': 'https',
                      'X-Forwarded-Proto': 'https',
                    },

                    formData: {
                      file: fs.createReadStream('snyk_output.txt')
                    },
                  };
                  
                  try {
                    await rp(attachment);
                  } catch (error) {
                    console.error(`Error attaching file to Jira ticket: ${error}`);
                    return;
                  }
                  
                  console.log(`Jira ticket ${issueResponse.key} created successfully.`);
                  return issueResponse;
            } else {
                  console.log('Epic Not Found!')
            }
      }
}


          (async () => {
            const consoleOutputFile = process.argv[2];
            const jsonData = fs.readFileSync(consoleOutputFile, 'utf-8');

            const vulnerabilities = parseSnykOutput(jsonData);
            // console.log("Vulnerabilities:", JSON.stringify(vulnerabilities, null, 2));
            console.log(`Parsed vulnerabilities: ${vulnerabilities.length}`);

            const uniqueVulnerabilities = Array.from(new Set(vulnerabilities.map(v => v.title)))
              .map(title => {
                return vulnerabilities.find(v => v.title === title);
              });

            const seenTitles = new Set();

            for (const vulnerability of uniqueVulnerabilities) {
              if (seenTitles.has(vulnerability.title)) {
                console.log(`Skipping duplicate vulnerability: ${vulnerability.title}`);
                continue;
              }
              seenTitles.add(vulnerability.title);
              try {

                let resp;
                console.log(`Creating Jira ticket for vulnerability: ${vulnerability.title}`);
                resp = await createJiraTicket(vulnerability);
                console.log(resp)
              } catch (error) {
                console.error(`Error while creating Jira ticket for vulnerability ${vulnerability.title}:`, error);
              }
            }
  

})();
