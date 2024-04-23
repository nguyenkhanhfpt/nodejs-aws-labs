import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import {
  S3Client,
  ListBucketsCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const commandListBuckets = new ListBucketsCommand({});

(async () => {
  console.log("Start send...");

  try {
    const [listBuckets, listObjects] = await Promise.all([
      client.send(commandListBuckets),
      client.send(
        new ListObjectsCommand({
          Bucket: process.env.BUCKET_NAME,
        })
      ),
    ]);

    console.log(listBuckets);
    console.log(listObjects);

    console.log("End send...");
  } catch (error) {
    console.log(error);
  }
})();
