import { testFormMatrix } from "./testMatrix";
import { PatternMiner } from "../pattern/patternMiner";
import { readFile, writeArray } from "../utils/file";

let miner = new PatternMiner();
let data = readFile("test_ip.csv");
let arr = miner.mine(data);
console.log(arr);
writeArray(arr, "test.json");
