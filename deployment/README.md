# Deployment

## AWS CDK Account Bootstrap Instructions

Before deploying this AWS CDK project into an AWS account, the account must be bootstrapped. Bootstrapping is required to set up the necessary resources (like an S3 bucket and IAM roles) that CDK uses internally for deployments.

Due to restrictions in our AWS accounts, the standard CDK bootstrap template cannot be used. Instead, we have a custom bootstrap template (`bootstrap-template.yaml`) stored in this repository.

### Bootstrapping Instructions

To bootstrap an AWS account using our custom template, run the following command:

````bash
PROJECT=mcr cdk bootstrap aws://<account number>/us-east-1 --template deployment/bootstrap-template.yaml --context stage=bootstrap
./   ```

Replace `<account number>` with the target AWS account number.

The AWS account will be bootstrapped with the custom bootstrap template and ready for deploying this CDK project.

---

For further details on AWS CDK bootstrapping, refer to the [AWS CDK documentation](https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html).
````
