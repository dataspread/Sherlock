
const pattern = "<S>(<intany 0:-1 false>`<U>(- <empty>)`<intany 0:-1 false>`;`=`IF`(`<wordany 4:4>`>` `<intany 1:1 false>`,`<wordany 4:4>`,` `<intany 1:1 false>`)`;`=`SUM`(`<wordany 3:3>`,` `B`<intany 2:2 false>`)`;`=`C`<intany 2:2 false>`+`<intany 1:1 false>)"
const ori_pat = "<S>(<intany 0:-1, false>,<U>(-,<empty>),<intany 0:-1, false>,;,=,IF,(,<wordany 4:4>,>, ,<intany 1:1, false>,,,<wordany 4:4>,,, ,<intany 1:1, false>,),;,=,SUM,(,<wordany 3:3>,,, ,B,<intany 2:2, false>,),;,=,C,<intany 2:2, false>,+,<intany 1:1, false>)"

const formMatrix = [
    ["-5", "=IF(A16 > 0, A16, 0)", "=SUM(A16, B16)", "=C16+1"],
    ["-4", "=IF(A17 > 0, A17, 0)", "=SUM(A17, B17)", "=C17+1"],
    ["-3", "=IF(A18 > 0, A18, 0)", "=SUM(A18, B18)", "=C18+1"],
    ["-2", "=IF(A19 > 0, A19, 0)", "=SUM(A19, B19)", "=C19+1"],
    ["-1", "=IF(A20 > 0, A20, 0)", "=SUM(A20, B20)", "=C20+1"],
    ["0", "=IF(A21 > 0, A21, 0)", "=SUM(A21, B21)", "=C21+1"],
    ["1", "=IF(A22 > 0, A22, 0)", "=SUM(A22, B22)", "=C22+1"],
    ["2", "=IF(A23 > 0, A23, 0)", "=SUM(A23, B23)", "=C23+1"],
    ["3", "=IF(A24 > 0, A24, 0)", "=SUM(A24, B24)", "=C24+1"],
    ["4", "=IF(A25 > 0, A25, 0)", "=SUM(A25, B25)", "=C25+1"],
    ["5", "=IF(A26 > 0, A26, 0)", "=SUM(A26, B26)", "=C26+1"],
    ["6", "=IF(A27 > 0, A27, 0)", "=SUM(A27, B27)", "=C27+1"],
    ["7", "=IF(A28 > 0, A28, 0)", "=SUM(A28, B28)", "=C28+1"],
    ["8", "=IF(A29 > 0, A29, 0)", "=SUM(A29, B29)", "=C29+1"],
    ["9", "=IF(A30 > 0, A30, 0)", "=SUM(A30, B30)", "=C30+1"],
]

const typeSizes = {
    "undefined": () => 0,
    "boolean": () => 4,
    "number": () => 8,
    "string": item => 2 * item.length,
    "object": item => !item ? 0 : Object
      .keys(item)
      .reduce((total, key) => sizeof(key) + sizeof(item[key]) + total, 0)
  };
  
const sizeof = value => typeSizes[typeof value](value);

console.log("Size of formula matrix:", sizeof(formMatrix))

function trim(s, c) {
  if (c === "]") c = "\\]";
  if (c === "^") c = "\\^";
  if (c === "\\") c = "\\\\";
  return s.replace(new RegExp(
    "^[" + c + "]+|[" + c + "]+$", "g"
  ), "");
}

function isNumber(c) {
  if (typeof c !== 'string') {
    return false;
  }

  if (c.trim() === '') {
    return false;
  }

  return false;//!isNaN(c);
}

function compressFormulaMatrix(formMatrix, pattern) {
    if (pattern.substring(0, 3) === "<S>") {
        pattern = pattern.substring(4, pattern.length - 1)
    }

    let patterns = pattern.split(";")
    let result = { 0: pattern }

    for (let i = 0; i < patterns.length; i += 1) {
      patterns[i] = patterns[i].split("`")
      patterns[i] = patterns[i].filter(s => { return s.length !== 0 })
    }

    for (let row = 0; row < formMatrix.length; row += 1) {
      for (let col = 0; col < formMatrix[row].length; col += 1) {
        let p = patterns[col]
        let f = formMatrix[row][col]
        for (let i = 0; i < p.length; i += 1) {
          if (p[i].startsWith("<intany")) {

          } else if (p[i].startsWith("<wordany")) {

          }
        }
      }
    }

    return result
}

let compressed = compressFormulaMatrix(formMatrix, pattern)

console.log("Size of compressed JSON:", sizeof(compressed))