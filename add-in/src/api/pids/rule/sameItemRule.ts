import { RewriteRule } from "./rewriteRule";
import { PUnion, PSeq, PToken, PEmpty, Pattern } from "../pattern/pattern";

export class SameItemRule extends RewriteRule {
  condition(ptn) {
    if (ptn instanceof PUnion || ptn instanceof PSeq) {
      return true;
    }

    return false;
  }

  update(ptn: Pattern) {
    if (ptn instanceof PSeq) {
      let result = ptn.content.map((cont) => {
        if (cont instanceof PUnion) {
          return this.combineUnion(cont);
        } else {
          return cont;
        }
      });
      return result;
    }
    return ptn;
  }

  combineUnion(ptn: PUnion) {
    let content = ptn.content;
    if (content.length === 0) {
      return new PEmpty();
    }
    let allEqual: Boolean = true;
    let first = content[0].content;
    content.forEach((seq) => {
      if (seq.content.toString() !== first.toString()) {
        allEqual = false;
      }
    });
    if (allEqual) {
      return new PToken(first);
    }
    return ptn;
  }
}
