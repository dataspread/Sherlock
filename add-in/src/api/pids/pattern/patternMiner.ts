import { Tokenizer } from "../tokenize/tokenizer";

export class PatternMiner {
  sampleSize = 500;

  rules = []; // fill in with rules later

  mine(lines) {
    let tokens = lines.map((line) => Tokenizer.tokenize(line));
  }

  refine() {}
}
