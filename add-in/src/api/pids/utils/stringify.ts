export function stringifyArray(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i += 1) {
    result.push(arr[i].toString());
  }
  return result;
}

export function stringifyMatrix(mat) {
  let result = [];
  for (let i = 0; i < mat.length; i += 1) {
    result.push(stringifyArray(mat[i]));
  }
  return result;
}
