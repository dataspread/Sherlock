import { PUnion, PSeq, PToken } from "./pattern";
import { transposeMatrix } from "../utils/matrix";

const getPSeqString = (seq) => seq.content.map((token) => token.toString()).join("");

export function repack(pattern, entries) {
  if (!(pattern instanceof PSeq || pattern instanceof PUnion)) {
    pattern = new PSeq(pattern);
  }
  let result = [];
  for (let idx = 0; idx < entries; idx += 1) {
    result.push(getPatternArray(pattern, idx));
  }
  return result;
}

function getPatternArray(pattern, idx) {
  if (pattern instanceof PToken) {
    return [pattern.token.toString()];
  }
  let hasSubpattern = false;
  pattern.content.forEach((subpattern) => {
    if (subpattern instanceof PSeq || subpattern instanceof PUnion) {
      hasSubpattern = true;
    }
  });
  if (hasSubpattern && pattern instanceof PSeq) {
    let line = [];
    pattern.content.forEach((subpattern) => {
      let arr = getPatternArray(subpattern, idx);
      line.push(...arr);
    });
    return line;
  } else if (hasSubpattern && pattern instanceof PUnion) {
    return getPatternArray(pattern.content[idx], idx);
  } else if (pattern instanceof PSeq) {
    return [getPSeqString(pattern)];
  } else if (pattern instanceof PUnion) {
    return [pattern.content[idx]];
  }
  return [];
}

export function combineConstantCols(mat: string[][]) {
  /* Transpose matrix for better cache locality. */
  let constantCols = new Set();
  for (let x = 0; x < mat[0].length; x += 1) {
    let constant = true;
    let firstVal = mat[0][x];
    for (let y = 0; y < mat.length; y += 1) {
      if (mat[y][x] !== firstVal) {
        constant = false;
        break;
      }
    }
    if (constant) {
      constantCols.add(x);
    }
  }

  let result = [];
  for (let y = 0; y < mat.length; y += 1) {
    let resultRow = [];
    let runningString = "";
    for (let x = 0; x < mat[0].length; x += 1) {
      if (constantCols.has(x)) {
        runningString += mat[y][x];
      } else {
        if (runningString.length !== 0) {
          resultRow.push(runningString);
          runningString = "";
        }
        resultRow.push(mat[y][x]);
      }
    }
    if (runningString.length !== 0) {
      resultRow.push(runningString);
    }
    result.push(resultRow);
  }
  return result;
}
