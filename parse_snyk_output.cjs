const fs = require('fs');
const JiraClient = require('jira-client');

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




async function createJiraTicket(vulnerability) {
  const issue = {
    fields: {
      project: {
        key: process.env.JIRA_PROJECT_KEY,
      },
      summary: vulnerability.title,
      description: vulnerability.description,
      issuetype: {
        name: process.env.JIRA_ISSUE_TYPE,
      },
      labels: process.env.JIRA_LABELS.split(','),
    },
  };

  try {
    const jiraUrl = `${process.env.JIRA_BASE_URL}/rest/api/2/issue`;
    console.log('JIRA_URL:', jiraUrl);
    await jira.addNewIssue(issue);
    console.log(`Jira ticket created for vulnerability: ${vulnerability.title}`);
  } catch (error) {
    console.error('Error creating Jira ticket:', error);
  }
}


(async () => {
  const consoleOutputFile = process.argv[2];
  const jsonData = fs.readFileSync(consoleOutputFile, 'utf-8');

  const vulnerabilities = parseSnykOutput(jsonData);
  console.log('after parse',vulnerabilities)
  console.log("Vulnerabilities:", JSON.stringify(vulnerabilities, null, 2));
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
      console.log(`Creating Jira ticket for vulnerability: ${vulnerability.title}`);
      await createJiraTicket(vulnerability);
    } catch (error) {
      console.error(`Error while creating Jira ticket for vulnerability ${vulnerability.title}:`, error);
    }
  }
  

})();
