function numToCol(col:number) {
    let letters = "";
    while (col >= 0) {
        letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[col % 26] + letters;
        col = Math.floor(col / 26) - 1;
    }
    return letters;
  }
  
export default function (row: number, col: number) {
    return `${numToCol(col)}${row}`;
}
  