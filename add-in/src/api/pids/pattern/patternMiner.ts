import { Tokenizer } from "../tokenize/tokenizer";
import { Pattern, PUnion, PSeq, PToken } from "./pattern";
import { CommonSymbolRule } from "../rule/commonSymbolRule";
import { CommonWordRule } from "../rule/commonWordRule";
import { SameItemRule } from "../rule/sameItemRule";

export class PatternMiner {
  sampleSize = 500;

  rules = [new CommonSymbolRule(), new CommonWordRule(), new SameItemRule()];

  getPSeqString = (seq) => seq.content.map((token) => token.toString()).join("");

  mine(lines) {
    let tokens = lines.map((line) => Tokenizer.tokenize(line));
    let translated = new PUnion(tokens.map((line) => new PSeq(line.map((elem) => new PToken(elem)))));

    let toRefine: Pattern = translated;
    let needRefine = true;
    let refineResult: Pattern = toRefine;

    while (needRefine) {
      console.log(toRefine.toString());
      let refined = this.refine(toRefine);
      console.log(refined[1]);
      if (refined[1] != null) {
        toRefine = refined[0];
      } else {
        needRefine = false;
        refineResult = refined[0];
      }
    }
    return this.repack(refineResult, lines.length);
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

  repack(pattern, entries) {
    if (!(pattern instanceof PSeq)) {
      pattern = new PSeq(pattern);
    }
    let result = [];
    for (let idx = 0; idx < entries; idx += 1) {
      result.push(this.getPatternArray(pattern, idx));
    }
    return result;
  }

  getPatternArray(pattern, idx) {
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
        let arr = this.getPatternArray(subpattern, idx);
        line.push(...arr);
      });
      return line;
    } else if (hasSubpattern && pattern instanceof PUnion) {
      return this.getPatternArray(pattern.content[idx], idx);
    } else if (pattern instanceof PSeq) {
      return [this.getPSeqString(pattern)];
    } else if (pattern instanceof PUnion) {
      return [pattern.content[idx]];
    }
    return [];
  }
}
