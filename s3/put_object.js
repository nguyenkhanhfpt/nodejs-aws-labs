import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createReadStream } from 'fs';

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const fileToBuffer = async function(path) {
    return new Promise((res, rej) => {
        let chunks = [];
        let stream = createReadStream(path);

        stream.on('data', (chunk) => {
            chunks.push(chunk);
        })

        stream.on('end', () => {
            res(Buffer.concat(chunks));
        });

        stream.on('error', (error) => {
            rej(error);
        });
    });
}

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
