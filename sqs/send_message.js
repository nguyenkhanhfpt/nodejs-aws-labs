import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import {
  SQSClient,
  SendMessageCommand,
  GetQueueUrlCommand,
} from "@aws-sdk/client-sqs";

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

    // run create_queue.js if not created before
    const queue = await client.send(
      new GetQueueUrlCommand({
        QueueName: process.env.AWS_QUEUE_NAME,
      })
    );
    const { QueueUrl } = queue;

    console.log("Get queue with URL:", QueueUrl);

    const sendMessageInputs = {
      QueueUrl,
      MessageBody: JSON.stringify({
        queueUrl: QueueUrl,
        message: "Hello World!",
      }),
    };
    const sendMessage = await client.send(
      new SendMessageCommand(sendMessageInputs)
    );

    console.log("Send message success!");
    console.log(sendMessage);
  } catch (error) {
    console.log(error);
  }
}

main();
