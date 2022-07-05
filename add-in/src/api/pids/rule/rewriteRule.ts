import { Pattern, PUnion, PSeq } from "../pattern/pattern";

export abstract class RewriteRule {
  modified = false;

  path = [];

  happen = () => (this.modified = true);

  happened = this.modified;

  reset = () => (this.modified = false);

  rewrite(root) {
    this.path.push(root);
    let result = null;

    if (root instanceof PUnion) {
      let union: PUnion = root;
      if (this.condition(union)) {
        this.update(union);
      } else {
        let modifiedContent = union.content.map((p) => this.rewrite(p));
        result = this.modified ? new PUnion(modifiedContent) : union;
      }
    } else if (root instanceof PSeq) {
      let seq: PSeq = root;
      if (this.condition(seq)) {
        this.update(seq);
      } else {
        let modifiedContent = seq.content.map((p) => this.rewrite(p));
        result = this.modified ? new PSeq(modifiedContent) : seq;
      }
    } else {
      let pattern: Pattern = root;
      result = this.condition(pattern) ? this.update(pattern) : pattern;
    }

    this.path.pop();
    return result;
  }

  abstract condition(ptn);

  abstract update(ptn);
}
