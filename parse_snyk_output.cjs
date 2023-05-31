const fs = require('fs');
const JiraClient = require('jira-client');
const axios = require('axios');


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


async function createJiraTicket(vulnerability) {
  // JQL query with relative date math, 
  // status conditions 
  const title = vulnerability.title.replaceAll("\"", "\\\"");
  //let jqlQuery = `project = "${process.env.JIRA_PROJECT_KEY}" AND summary ~ "${process.env.JIRA_TITLE_PREFIX}  ${title}" AND created >= startOfDay("-60d") AND status NOT IN ("Closed", "Cancelled")`;
  let jqlQuery = `project = "${process.env.JIRA_PROJECT_KEY}" AND summary ~ "MCR - ${vulnerability.title}" AND created >= startOfDay("-60d") AND status NOT IN ("Closed", "Cancelled")`;

  let searchResult = await jira.searchJira(jqlQuery);

  if (!searchResult.issues || searchResult.issues.length === 0) {
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
        "customfield_10007" : process.env.JIRA_EPIC_KEY,
      },
    };

    const issueResponse = await jira.addNewIssue(issue);
    console.log(`Jira ticket created for vulnerability: ${vulnerability.title}`);

    // Use the addAttachmentOnIssue method from Jira library
    await jira.addAttachmentOnIssue(issueResponse.key, fs.createReadStream('snyk_output.txt'));
    console.log(`Jira ticket ${issueResponse.key} created successfully.`);

    return issueResponse;
  } else {
    console.log(`Active Jira ticket already exists for vulnerability: ${vulnerability.title}`);
  }
}

  (async () => {
    const consoleOutputFile = process.argv[2];
    const jsonData = fs.readFileSync(consoleOutputFile, 'utf-8');

    const vulnerabilities = parseSnykOutput(jsonData);
    console.log(`Parsed vulnerabilities: ${vulnerabilities.length}`);

    const uniqueVulnerabilities = Array.from(new Set(vulnerabilities.map(v => v.title)))
      .map(title => {
        return vulnerabilities.find(v => v.title === title);
      });

    for (const vulnerability of uniqueVulnerabilities) {
      try {
        console.log(`Creating Jira ticket for vulnerability: ${vulnerability.title}`);
        const resp = await createJiraTicket(vulnerability);
        console.log(resp)
      } catch (error) {
        console.error(`Error while creating Jira ticket for vulnerability ${vulnerability.title}:`, error);
      }
    }

  })();



