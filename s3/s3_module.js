import { createReadStream } from 'fs';

const fileToBuffer = async function (path) {
  return new Promise((res, rej) => {
    let chunks = [];
    let stream = createReadStream(path);

    stream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    stream.on("end", () => {
      res(Buffer.concat(chunks));
    });

    stream.on("error", (error) => {
      rej(error);
    });
  });
};

export { fileToBuffer };
