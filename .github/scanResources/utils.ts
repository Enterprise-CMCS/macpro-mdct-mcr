import { createInterface } from "readline";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { IAMClient, ListAccountAliasesCommand } from "@aws-sdk/client-iam";

export function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
}

export async function getAccountId(): Promise<string | undefined> {
  try {
    const sts = new STSClient({});
    const idResp = await sts.send(new GetCallerIdentityCommand({}));
    return idResp.Account;
  } catch {
    return undefined;
  }
}

export async function getAccountIdentifier(): Promise<string> {
  const iam = new IAMClient({});
  let alias: string | undefined;
  const accountId = await getAccountId();
  try {
    const aliasResp = await iam.send(new ListAccountAliasesCommand({}));
    if (aliasResp.AccountAliases && aliasResp.AccountAliases.length > 0) {
      alias = aliasResp.AccountAliases[0];
    }
  } catch {
    // ignore
  }

  return (alias || accountId || "unknown-account").replace(
    /[^a-zA-Z0-9-_]/g,
    "_"
  );
}
