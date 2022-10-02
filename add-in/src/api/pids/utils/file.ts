let fs = require("fs");
const path = "add-in/src/api/pids/test/";

export function readFile(filename: string) {
  let text = fs.readFileSync(path + filename, "utf-8");
  let data = text.split("\n").map((row) => row.split(","));
  return data;
}

export function writeArray(arr: any[], filename: string) {
  let payload = JSON.stringify(arr, null, 2);
  let err = (err) => {
    if (err) {
      console.log(err);
    }
  };
  fs.writeFile(path + filename, payload, err);
}
