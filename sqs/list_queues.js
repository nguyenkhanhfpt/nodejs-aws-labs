import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import { SQSClient, ListQueuesCommand } from "@aws-sdk/client-sqs";

const client = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

async function main() {
  try {
    const data = await client.send(new ListQueuesCommand({}));

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

main();
