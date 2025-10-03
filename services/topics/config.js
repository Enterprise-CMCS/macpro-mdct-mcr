export default [
  {
    topicPrefix: "aws.mdct.mcr",
    version: ".v0",
    numPartitions: 1,
    replicationFactor: 3,
    topics: [
      ".mcpar-reports",
      ".mcpar-form",
      ".mcpar-form-template",
      ".mlr-reports",
      ".mlr-form",
      ".mlr-form-template",
      ".naaar-reports",
      ".naaar-form",
      ".naaar-form-template",
    ],
  },
];
