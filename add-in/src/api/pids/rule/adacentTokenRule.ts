import { RewriteRule } from "./rewriteRule";
import { PToken, Pattern } from "../pattern/pattern";
import { TWord } from "../tokenize/token";

/* If two tokens are adjacent to each other, combine them. */
export class AdjacentTokenRule extends RewriteRule {
  condition(_) {
    return true;
  }

  update(ptn: Pattern) {
    if (ptn instanceof Array) {
      let result = [];
      let runningToken = "";
      ptn.forEach((subpattern) => {
        if (subpattern instanceof PToken) {
          runningToken += subpattern.token.toString();
        } else {
          if (runningToken.length !== 0) {
            result.push(new PToken(new TWord(runningToken)));
            runningToken = "";
          }
          result.push(subpattern);
        }
      });
      return result;
    }
    return ptn;
  }
}
