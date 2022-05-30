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
  //   {
  //     name: "double",
  //     tester: function (tested) {
  //       var regResult = tested.match(/[+-]?([0-9]*[.])?[0-9]+/);
  //       if (regResult && regResult[0] === tested) {
  //         return lexerResults.possible;
  //       } else {
  //         return lexerResults.none;
  //       }
  //     },
  //   },
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
    return tokens.map((token) => {
      switch (token.type) {
        case "word":
          return new TWord(token.value);
        case "int":
          return new TInt(parseInt(token.value));
        case "double":
          return new TDouble(parseFloat(token.value));
        case "symbol":
          return new TSymbol(token.value);
        case "space":
          return new TSpace();
        default:
          console.log("Token type does not exist!");
          return new TSymbol("");
      }
    });
  }
}
