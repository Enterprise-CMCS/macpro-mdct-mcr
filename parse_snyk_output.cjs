const fs = require('fs');
const JiraClient = require('jira-client');
const rp = require('request-promise');


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

  // Your custom logic to parse non-JSON inputData
  const defaultTitle = 'Vulnerability Detected';

  vulnerabilities.push({
    title: defaultTitle,
    description: `Non-JSON output from Snyk:\n\n${inputData}`
  });

  return vulnerabilities;
}


function formatVulDescr(vulnerability) {
  let description = `*Overview*:\n\n${vulnerability.description.split('\n')[0]}\n\n`;
  description += `*PoC*:\n\n${vulnerability.description.split('PoC by')[1].split('Details')[0]}\n\n`;
  description += `*Details*:\n\n${vulnerability.description.split('Details')[1].split('Remediation')[0]}\n\n`;
  description += `*Remediation*:\n\n${vulnerability.description.split('Remediation')[1].split('References')[0]}\n\n`;
  description += `*References*:\n\n${vulnerability.description.split('References')[1]}\n\n`;
  return description;
}




async function createJiraTicket(vulnerability) {

  //const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];

  // cancel all tickets with the given title from the past given days
  let jqlQuery = `project = "${process.env.JIRA_PROJECT_KEY}" AND summary ~ "${vulnerability.title}" AND created >= ${today}`;
  let searchResult = await jira.searchJira(jqlQuery);

   // Find the transition id for 'Cancel' or 'Close'
  const transitions = await jira.listTransitions(issue.key);
  const cancelTransition = transitions.transitions.find(transition => transition.name.toLowerCase() === 'cancel' || transition.name.toLowerCase() === 'close');

  if (searchResult.issues && searchResult.issues.length > 0) {
    for (const issue of searchResult.issues) {
      //await jira.deleteIssue(issue.id);
      await jira.transitionIssue(issue.id, { transition: { id: cancelTransition } }); 
      console.log(`Jira ticket with title '${vulnerability.title}' Closed: ${issue.key}`);
    }
  }

  const issue = {
    fields: {
      project: {
        key: process.env.JIRA_PROJECT_KEY,
      },
      summary: `[MCR] - ${vulnerability.title}`,
      description: vulnerability.description,
      issuetype: {
        name: process.env.JIRA_ISSUE_TYPE,
      },
      labels: process.env.JIRA_LABELS.split(','),
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
