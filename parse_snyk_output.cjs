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
 
  //console.log(inputData)
  if (inputData) {
    try {
      const data = JSON.parse(inputData);
      vulnerabilities = data.vulnerabilities || [];
      console.log(vulnerabilities)
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
  // for testing 
  // const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  // const twoDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Remove all tickets with the given title from the past 5 days
  // let jqlQuery = `project = "${process.env.JIRA_PROJECT_KEY}" AND summary ~ "Regular Expression Denial of Service (ReDoS)" AND created >= ${fiveDaysAgo}`;
  // let searchResult = await jira.searchJira(jqlQuery);
  // if (searchResult.issues && searchResult.issues.length > 0) {
  //   for (const issue of searchResult.issues) {
  //     try {
  //       await jira.deleteIssue(issue.id);
  //       console.log(`Jira ticket with title 'Regular Expression Denial of Service (ReDoS)' deleted: ${issue.key}`);
  //     } catch (error) {
  //       console.error('Error deleting Jira ticket:', error);
  //     }
     
  //   }
  // }

  // Check if ticket already exists for the given vulnerability within the last 5 days
  // jqlQuery = `project = "${process.env.JIRA_PROJECT_KEY}" AND summary ~ "${vulnerability.title}" AND created >= ${twoDaysAgo}`;
  // try {
  //   searchResult = await jira.searchJira(jqlQuery);
  // } catch (error) {
  //   console.error('Error searching Jira:', error);
  // }

  // if (searchResult.issues && searchResult.issues.length > 0) {
  //   console.log(`Jira ticket already exists for vulnerability: ${vulnerability.title}`);
  //   return;
  // } else {
    console.log('From create',vulnerability)
      // If no such ticket, then create one
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
