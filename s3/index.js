import { createReadStream } from "fs";

async function main(path) {
  return new Promise((res, rej) => {
    let stream = createReadStream(path, { highWaterMark: 5000000 });
    let lists = [];

    stream.on("data", (chunk) => {
      console.log(Buffer.byteLength(chunk));
      lists.push(chunk);
    });

    stream.on("end", () => {
      res(lists);
    });
  });
}

main("./png-5mb-1.png").then(res => {
    console.log(res)
})
