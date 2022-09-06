import { lexer, lexerResults } from "js-lexer";
import { TWord, TInt, TDouble, TSymbol, TSpace } from "./token";

const conds = [
  {
    name: "word",
    tester: function (tested) {
      var regResult = tested.match(/[a-zA-Z]+/);
      if (regResult && regResult[0] === tested) {
        return lexerResults.possible;
      } else {
        return lexerResults.none;
      }
    },
  },
  {
    name: "int",
    tester: function (tested) {
      var regResult = tested.match(/\d+/);
      if (regResult && regResult[0] === tested) {
        return lexerResults.possible;
      } else {
        return lexerResults.none;
      }
    },
  },
  {
    name: "space",
    tester: function (tested) {
      if (tested === " ") {
        return lexerResults.exact;
      } else {
        return lexerResults.none;
      }
    },
  },
  {
    name: "symbol",
    tester: function (tested) {
      var regResult = tested.match(/[^a-zA-Z0-9]/g);
      if (regResult && regResult[0] === tested) {
        return lexerResults.possible;
      } else {
        return lexerResults.none;
      }
    },
  },
];

export class Lexer {
  static lex(str) {
    let tokens = lexer(str, conds);
    let result = [];
    tokens.forEach((token) => {
      let type = token.type;
      let value = token.value;
      if (type === "word") {
        result.push(new TWord(value));
      } else if (type === "int") {
        // To handle the edge case of a number starting with a 0, we don't want to remove the 0
        while (value[0] === "0") {
          result.push(new TInt(0));
          value = value.slice(1);
        }
        if (value.length !== 0) {
          result.push(new TInt(parseInt(value)));
        }
      } else if (type === "double") {
        result.push(new TDouble(parseFloat(value)));
      } else if (type === "symbol") {
        result.push(new TSymbol(value));
      } else if (type === "space") {
        result.push(new TSpace());
      } else {
        console.log("Token type does not exist!");
        result.push(new TSymbol(""));
      }
    });
    return result;
  }
}
