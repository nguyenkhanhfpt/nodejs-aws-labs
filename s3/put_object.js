import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fileToBuffer } from "./s3_module.js";

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

async function main() {
    try {
        let fileBody = await fileToBuffer('./filename.jpg');
        let input = {
            Bucket: process.env.BUCKET_NAME,
            Body: fileBody,
            Key: "filename.jpg",
        }
    
        console.log('Start send...')
        let res = await client.send(new PutObjectCommand(input));

        console.log(res)
    } catch (e) {
        console.log(e);
    }
}

main();
