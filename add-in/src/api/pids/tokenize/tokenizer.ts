import { Lexer } from "./lexer";

export class Tokenizer {
  static tokenize(line) {
    let tokens = [];
    for (let i = 0; i < line.length; i += 1) {
      tokens.push(...Lexer.lex(line[i]));
    }
    return tokens;
  }
}
