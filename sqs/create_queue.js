import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import { SQSClient, CreateQueueCommand } from "@aws-sdk/client-sqs";

const client = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

async function main() {
  try {
    console.log("Start send...");
    const createQueueInputs = {
      QueueName: process.env.AWS_QUEUE_NAME,
      Attributes: {
        VisibilityTimeout: "20",
      },
    };

    const data = await client.send(new CreateQueueCommand(createQueueInputs));

    console.log("Create queue success!");
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

main();
