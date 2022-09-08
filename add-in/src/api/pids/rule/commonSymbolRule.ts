import { RewriteRule } from "./rewriteRule";
import { PUnion, PSeq, PToken, PEmpty } from "../pattern/pattern";
import { TSymbol } from "../tokenize/token";
import { CommonSeq } from "./commonSeq";
import { stringifyTensor } from "../utils/stringify";

export class CommonSymbolRule extends RewriteRule {
  condition(ptn) {
    if (!(ptn instanceof PUnion)) {
      return false;
    }

    let cnt = ptn.content;
    if (cnt.length <= 1) {
      return false;
    }

    let res = cnt.map((x) => {
      if (x instanceof PSeq) {
        return [x.content.every((t) => t instanceof PToken || t == PEmpty), x.content.length];
      } else if (x instanceof PToken) {
        return [true, 1];
      } else if (x == PEmpty) {
        return [true, 1];
      } else {
        return [false, 0];
      }
    });

    return res.some((x) => x[1] > 1) && res.every((x) => x[0]);
  }

  update(union: PUnion) {
    // Flatten the union content
    let unionData = union.content.map((item) => {
      let result = [item];
      if (item instanceof PSeq) {
        result = item.content;
      } else if (item instanceof PEmpty) {
        result = [];
      }
      return result;
    });
    if (unionData.length === 1) {
      return union;
    }

    // Scan union data for symbols
    let symbolsWithPos = unionData.map((line) =>
      line
        .map((value, index) => [value, index])
        .filter((value) => {
          if (value[0] instanceof PToken) {
            return value[0].token instanceof TSymbol;
          }
          return false;
        })
    );

    // Valid lines have at least one symbol
    let noSymbolLines = new Set<number>();
    let validLinesWithIndex = new Set<Array<any>>();
    symbolsWithPos
      .map((value, idx) => [value, idx])
      .forEach((value) => {
        if ((value[0] as Array<any[]>).length === 0) {
          noSymbolLines.add(value[1] as number);
        } else {
          validLinesWithIndex.add(value);
        }
      });

    if (noSymbolLines.size > 0) {
      return union;
    }

    let validLines = Array.from(validLinesWithIndex).map((value) => value[0]);

    // Determine common symbols and match symbol in each line to the common
    let commonSeq = new CommonSeq();
    const eq = (a: Array<any>, b: Array<any>) => (a[0] as PToken).toString() === (b[0] as PToken).toString();
    let commonSymbols = commonSeq.find(validLines, eq).map((i) => i[0]);

    // If there are no common symbols, do nothing
    if (commonSymbols.length === 0) {
      return union;
    }

    // Filter out symbols that are not common
    let commonSymbolsWithPos = [];
    symbolsWithPos.forEach((line) => {
      let idx = 0;
      let commonSymbolLine = [];
      commonSymbols.forEach((symbol) => {
        while (line[idx] && symbol.token.value !== line[idx][0].token.value) {
          idx += 1;
        }
        commonSymbolLine.push(line[idx]);
        idx += 1;
      });
      commonSymbolsWithPos.push(commonSymbolLine);
    });

    // Package new union split by common symbols
    let resultSeq = [];
    this.happen();
    commonSymbols.forEach((symbol, symbolIdx) => {
      let beforeSymbolUnion = [];
      let nonEmpty: boolean = false;
      commonSymbolsWithPos.forEach((line, lineIdx) => {
        let startIdx = symbolIdx == 0 ? 0 : line[symbolIdx - 1][1] + 1;
        let endIdx = line[symbolIdx][1];
        const unionLine: any[] = union.content[lineIdx].content;
        if (endIdx - startIdx > 0) {
          let unit = unionLine.slice(startIdx, endIdx);
          beforeSymbolUnion.push(new PSeq(unit));
          nonEmpty = true;
        } else {
          beforeSymbolUnion.push(new PEmpty());
        }
      });
      if (nonEmpty) {
        resultSeq.push(new PUnion(beforeSymbolUnion));
      }
      resultSeq.push(symbol);
    });

    let afterSymbolUnion = [];
    let nonEmpty = false;
    commonSymbolsWithPos.forEach((line, lineIdx) => {
      let startIdx = line[line.length - 1][1] + 1;
      const unionLine: any[] = union.content[lineIdx].content;
      let endIdx = unionLine.length;

      if (endIdx - startIdx > 0) {
        let unit = unionLine.slice(startIdx, endIdx);
        afterSymbolUnion.push(new PSeq(unit));
        nonEmpty = true;
      } else {
        afterSymbolUnion.push(new PEmpty());
      }
    });
    if (nonEmpty) {
      resultSeq.push(new PUnion(afterSymbolUnion));
    }

    return new PSeq(resultSeq);
  }
}
