import { PatternMiner } from "./patternMiner";

/* 
    Extract a pattern from a formula matrix that is stored in row-major. 
    Returns an array of patterns corresponding to each column.
*/
export function extractPattern(formMatrix) {
  let miner = new PatternMiner();
  miner.sampleSize = 2000;
  let transpose = transposeArray(formMatrix);
  let patterns = [];
  for (let colIdx = 0; colIdx < transpose.length; colIdx += 1) {
    let pattern = miner.mine(transpose[colIdx]);
    patterns.push(pattern);
    console.log(pattern);
  }
  return patterns;
}

/* 
    Transpose the array to change it from row to column major. 
    We evaluate PIDS along each column.
*/
function transposeArray(formMatrix) {
  let result = JSON.parse(JSON.stringify(formMatrix));
  for (let i = 0; i < formMatrix.length; i += 1) {
    for (let j = 0; j < formMatrix[i].length; j += 1) {
      result[j][i] = formMatrix[i][j];
    }
  }
  return result;
}
