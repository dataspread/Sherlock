export class CommonSeq {
  bool2int = (b: Boolean) => (b ? 1 : 0);

  /**
   * Look for common sequence in a list of lines. For implementation
   * simplicity, only the longest common seq is returned
   *
   * @param lines
   * @return common sequences
   */
  find(lines: any[][], equal) {
    let commons = lines[0];

    if (lines.length == 1) {
      return commons;
    }
    lines.slice(1).forEach((line) => {
      if (commons.length !== 0) {
        let commonsBetween = this.between(commons, line, equal);
        // TODO: This is a placeholder. Refer to line 84 in CommonSeq.scala.
        commons = commonsBetween;
      }
    });
    return commons;
  }

  /**
   * Find the longest common subsequence in two arrays
   *
   * Algorithm from https://www.geeksforgeeks.org/printing-longest-common-subsequence/
   *
   * @param a     the first array
   * @param b     the second array
   * @param equal equality test function
   * @return array of common symbols
   */
  between(a: any[], b: any[], equal: (a: any, b: any) => Boolean): any[] {
    // Find the longest common in order subsequences
    let len1 = a.length;
    let len2 = b.length;
    let lcs = new Array(len1 + 1);
    for (let i = 0; i <= len1; i += 1) {
      lcs[i] = new Array(len2 + 1);
    }
    for (let i = 0; i <= len1; i += 1) {
      for (let j = 0; j <= len2; j += 1) {
        if (i == 0 || j == 0) {
          lcs[i][j] = 0;
        } else {
          if (equal(a[i - 1], b[j - 1])) {
            lcs[i][j] = 1 + lcs[i - 1][j - 1];
          } else {
            lcs[i][j] = Math.max(lcs[i][j - 1], lcs[i - 1][j]);
          }
        }
      }
    }

    // Reconstruct longest sequence
    let result = [];
    let i = len1;
    let j = len2;
    while (i > 0 && j > 0) {
      if (equal(a[i - 1], b[j - 1])) {
        result.push(a[i - 1]);
        i -= 1;
        j -= 1;
      } else {
        if (lcs[i][j - 1] > lcs[i - 1][j]) {
          j -= 1;
        } else {
          i -= 1;
        }
      }
    }
    return result.reverse();
  }
}
