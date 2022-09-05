import { testFormMatrix1 } from "./testMatrix";
import { stringifyArray } from "../utils/stringify";
import { Tokenizer } from "../tokenize/tokenizer";

console.log(stringifyArray(Tokenizer.tokenize(testFormMatrix[0])));
