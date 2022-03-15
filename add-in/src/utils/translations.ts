const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function numToCol(col:number) {
    let letters = "";
    while (col >= 0) {
        letters = alphabet[col % 26] + letters;
        col = Math.floor(col / 26) - 1;
    }
    return letters;
  }
  
export function numsToExcel (row: number, col: number) {
    return `${numToCol(col)}${row}`;
}

export function excelToNums (coord: String) {
    let colString = coord.match("[A-Z]+")[0];
    let row = parseInt(coord.match("[0-9]+")[0]);
    let col = 0;
    for(let p = 0, n = 0; p < colString.length; p++){
        n = colString.charCodeAt(p) - 64 + n * 26;
    }
    return [row, col]
}
