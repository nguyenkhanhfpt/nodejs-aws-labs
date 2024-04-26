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

async function main() {
  try {
    console.log("Start send...");
    const createResponse = await createMultipartUpload();
    const { UploadId } = createResponse;

    let uploadPartResults = await getUploadPartResults(UploadId);
    console.log("------------------");
    console.log(uploadPartResults);

    let completeUploadRes = await completeMultipartUpload(UploadId, uploadPartResults);
    console.log("------------------");
    console.log(completeUploadRes);
  } catch (e) {
    console.log(e);
  }
}

async function createMultipartUpload() {
  const command = new CreateMultipartUploadCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: objectKey,
  });

  return await client.send(command);
}

const getUploadPartResults = async (UploadId) => {
  try {
    const objFile = await fileToBuffer("./png-5mb-1.png");
    const partSize = 1024 * 1024 * 5;
    const parts = Math.ceil(objFile.length / partSize);
    let uploadPartsPromises = [];

    for (let i = 0; i < parts; i++) {
      let start = partSize * i;
      let end = Math.min(start + partSize, objFile.length);
      let partNumber = i + 1;

      let uploadPartsPromise = client
        .send(
          new UploadPartCommand({
            UploadId,
            Body: objFile.subarray(start, end),
            Bucket: process.env.BUCKET_NAME,
            Key: objectKey,
            PartNumber: partNumber,
          })
        )
        .then((d) => {
          console.log("Part", partNumber, "uploaded : ", d);

          return d;
        });

      uploadPartsPromises.push(uploadPartsPromise);
    }

    return await Promise.all(uploadPartsPromises);
  } catch (error) {
    throw error;
  }
};

async function completeMultipartUpload(UploadId, uploadPartResults) {
  return await client.send(
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
}

main();
