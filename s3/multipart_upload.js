import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { fileToBuffer } from "./s3_module.js";

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const objectKey = "largeobject.jpg";

let inputMultipartUpload = {
  Bucket: process.env.BUCKET_NAME,
  Key: objectKey,
};

async function main() {
  try {
    const command = new CreateMultipartUploadCommand(inputMultipartUpload);
    const response = await client.send(command);

    let { UploadId } = response;
    let objFile = await fileToBuffer("./png-5mb-1.png");

    const partSize = 1024 * 1024 * 5;
    const parts = Math.ceil(objFile.length / partSize);
    let uploadParts = [];

    for (let i = 0; i < parts; i++) {
      let start = partSize * i;
      let end = Math.min(start + partSize, objFile.length);

      uploadParts.push(
        client
          .send(
            new UploadPartCommand({
              UploadId,
              Body: objFile.subarray(start, end),
              Bucket: process.env.BUCKET_NAME,
              Key: objectKey,
              PartNumber: i + 1,
            })
          )
          .then((d) => {
            console.log("Part", i + 1, "uploaded : ", d);

            return d;
          })
      );
    }

    const uploadPartResults = await Promise.all(uploadParts);

    let uploadResponse = await client.send(
      new CompleteMultipartUploadCommand({
        UploadId,
        Bucket: process.env.BUCKET_NAME,
        MultipartUpload: {
          Parts: uploadPartResults.map(({ ETag }, i) => ({
            ETag,
            PartNumber: ++i,
          })),
        },
        Key: objectKey,
      })
    );

    console.log(uploadResponse);
  } catch (e) {
    console.log(e);
  }
}

main();
