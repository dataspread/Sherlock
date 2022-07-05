import BigDecimal from "bigdecimal";
import { hashCode } from "../utils/hash";

export abstract class Token {
  value: string;
  isData = false;
  length = 1;
  numChar = 1;

  toString = () => this.value.toString();

  canEqual(other) {
    return typeof other === typeof this;
  }

  equals(other) {
    if (other instanceof Token) {
      return other.canEqual(this) && this.value == other.value;
    }
    return false;
  }

  hashCode = () => hashCode(this.value);
}

export class TWord extends Token {
  constructor(v) {
    super();
    this.value = v.toString();
    this.isData = true;
    this.length = this.value.length;
  }
}

export class TInt extends Token {
  constructor(v) {
    super();
    this.value = v.toString();
    this.isData = true;
    this.intValue = BigInt(v);
  }

  intValue: BigInt;
  length = 4;
}

export class TDouble extends Token {
  constructor(v) {
    super();
    this.value = v.toString();
    this.isData = true;
    this.doubleValue = BigDecimal(this.value);
    this.length = this.doubleValue.toDouble().toFloat() ? 4 : 8;
  }

  doubleValue: BigDecimal;
  length = 4;
}

export class TSymbol extends Token {
  constructor(v) {
    super();
    this.value = v.toString();
  }
}

export class TSpace extends TSymbol {
  constructor() {
    super(" ");
  }
}
