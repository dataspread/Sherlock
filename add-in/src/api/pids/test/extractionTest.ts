import { testFormMatrix } from "./testMatrix";
import { extractPattern } from "../pattern/extractPattern";
import { readFile, writeArray } from "../utils/file";

let data = testFormMatrix; //readFile("test_ip.csv");
let arr = extractPattern(data);
console.log(arr);
writeArray(arr, "test.json");
