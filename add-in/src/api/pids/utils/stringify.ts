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

export function stringifyTensor(tensor, deg) {
  if (deg === 1) {
    return stringifyArray(tensor);
  }
  if (deg === 2) {
    return stringifyMatrix(tensor);
  }
  let result = [];
  for (let i = 0; i < tensor.length; i += 1) {
    result.push(stringifyTensor(tensor[i], deg - 1));
  }
  return result;
}
