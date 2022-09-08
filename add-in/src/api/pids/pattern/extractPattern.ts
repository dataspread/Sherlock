import { PatternMiner } from "./patternMiner";
import { transposeMatrix } from "../utils/matrix";

/* 
    Extract a pattern from a formula matrix that is stored in row-major. 
    Returns an array of patterns corresponding to each column.
*/
export function extractPattern(formMatrix) {
  let miner = new PatternMiner();
  miner.sampleSize = 2000;
  let transpose = transposeMatrix(formMatrix);
  let patterns = [];
  for (let colIdx = 0; colIdx < transpose.length; colIdx += 1) {
    let col = transposeMatrix([transpose[colIdx]]);
    let pattern = miner.mine(col);
    let transposed = transposeMatrix(pattern);
    patterns.push(...transposed);
  }
  return transposeMatrix(patterns);
}
