/* 
    Transpose a matrix array.
*/
export function transposeMatrix(formMatrix) {
  return formMatrix[0].map((_, colIndex) => formMatrix.map((row) => row[colIndex]));
}
