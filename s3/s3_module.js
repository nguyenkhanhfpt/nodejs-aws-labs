import { createReadStream } from "fs";

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

const getListStreamData = async function (path, options = {}) {
  return new Promise((res, rej) => {
    let stream = createReadStream(path, options);
    let lists = [];

    stream.on("data", (chunk) => {
      lists.push(chunk);
    });

    stream.on("end", () => {
      res(lists);
    });

    stream.on("error", (error) => {
      rej(error);
    });
  });
};

export { fileToBuffer, getListStreamData };
