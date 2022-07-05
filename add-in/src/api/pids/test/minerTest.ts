import { testFormMatrix1 } from "./testMatrix";
import { PatternMiner } from "../pattern/patternMiner";

let miner = new PatternMiner();
console.log(miner.mine(testFormMatrix1).toString());
