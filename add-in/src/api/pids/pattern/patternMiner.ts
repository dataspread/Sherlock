import { Tokenizer } from "../tokenize/tokenizer";
import { Pattern, PUnion, PSeq, PToken } from "./pattern";
import { CommonSymbolRule } from "../rule/commonSymbolRule";
import { SameItemRule } from "../rule/sameItemRule";

export class PatternMiner {
  sampleSize = 500;

  rules = [new CommonSymbolRule(), new SameItemRule()];

  mine(lines) {
    let tokens = lines.map((line) => Tokenizer.tokenize(line));
    let translated = new PUnion(tokens.map((line) => new PSeq(line.map((elem) => new PToken(elem)))));

    let toRefine: Pattern = translated;
    let needRefine = true;
    let refineResult: Pattern = toRefine;
    while (needRefine) {
      let refined = this.refine(toRefine);
      if (refined[1] != null) {
        toRefine = refined[0];
      } else {
        needRefine = false;
        refineResult = refined[0];
      }
    }
    return refineResult;
  }

  refine(root) {
    let current = root;
    for (let i = 0; i < this.rules.length; i += 1) {
      const rule = this.rules[i];
      rule.reset();
      current = rule.rewrite(current);
      if (rule.modified) {
        return [current, rule];
      }
    }
    return [current, null];
  }
}
