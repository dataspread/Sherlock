import { Token } from "../tokenize/token";

export abstract class Pattern {
  name: string;

  getName() {
    return this.name;
  }

  /**
   * @return all leaf patterns
   */
  flatten() {
    return [this];
  }

  /**
   * Recursively visit the pattern elements starting from the root
   *
   * @param visitor
   */
  visit = (visitor) => {
    visitor.on(this);
  };

  abstract numChar();
}

export class PToken extends Pattern {
  token: Token;

  constructor(token) {
    super();
    this.token = token;
  }

  numChar() {
    return this.token.numChar, this.token.numChar;
  }

  canEqual = (other) => other instanceof PToken;

  equals(other) {
    if (other instanceof PToken) {
      return other.canEqual(this) && this.token == other.token;
    }
    return false;
  }

  override toString = () => this.token.toString();
}

export class PSeq extends Pattern {
  content = [];

  constructor(contents) {
    super();
    this.content = contents;
  }

  flatten = () => this.content.map((x) => x.flatten());

  visit = (visitor) => {
    visitor.on(this);
    visitor.enter(this);
    this.content.map((x) => x.visit(visitor));
    visitor.exit(this);
  };

  numChar = () => {
    this.content.map((x) => x.numChar()).reduce((a, b) => a + b);
  };

  canEqual = (other) => other instanceof PSeq;

  equals = (other) => {
    if (other instanceof PSeq) {
      return other.canEqual(this) && this.content == other.content;
    }
    return false;
  };

  override toString = () => `<S>(${this.content.map((x) => x.toString()).join(",")})`;
}

export class PUnion extends Pattern {
  content = [];

  constructor(content) {
    super();
    this.content = content;
  }

  flatten = () => this.content.map((x) => x.flatten());

  visit = (visitor) => {
    visitor.on(this);
    visitor.enter(this);
    this.content.map((x) => x.visit(visitor));
    visitor.exit(this);
  };

  numChar = () => {
    this.content.map((x) => x.numChar()).reduce((a, b) => Math.min(a, b) + Math.max(a, b));
  };

  canEqual = (other) => other instanceof PUnion;

  equals = (other) => {
    if (other instanceof PUnion) {
      return other.canEqual(PUnion) && this.content == other.content;
    }
    return false;
  };

  override toString = () => `<U>(\n${this.content.map((x) => x.toString()).join(",\n")}\n)`;
}

export class PEmpty extends Pattern {
  numChar = () => [0, 0];

  override toString = () => "<empty>";
}

abstract class PAny extends Pattern {
  minLength;
  maxLength;

  constructor(minLength, maxLength) {
    super();
    this.minLength = minLength;
    this.maxLength = maxLength;
  }

  numChar = () => [this.minLength, this.maxLength];

  canEqual(other) {
    return typeof other === typeof this;
  }

  equals(other) {
    if (other instanceof PAny) {
      return other.canEqual(PAny) && this.minLength == other.minLength && this.maxLength == other.maxLength;
    }
    return false;
  }
}

export class PIntAny extends PAny {
  hasHex = false;

  constructor(minl = 1, maxl = -1, hasHex = false) {
    super(minl, maxl);
    this.hasHex = hasHex;
  }

  equals(other) {
    if (other instanceof PIntAny) {
      return this.canEqual(other) && this.minLength == other.minLength && this.maxLength == other.maxLength;
    }
    return false;
  }

  override toString = () => `<intany ${this.minLength}:${this.maxLength}, ${this.hasHex}>`;
}

export class PLetterAny extends PAny {
  constructor(minl = 1, maxl = -1) {
    super(minl, maxl);
  }

  override toString = () => `<letterany ${this.minLength}:${this.maxLength}>`;
}

/**
 * Mix of letter and digits
 */
export class PLabelAny extends PAny {
  constructor(minl = 1, maxl = -1) {
    super(minl, maxl);
  }

  override toString = () => `<labelany ${this.minLength}:${this.maxLength}>`;
}

export class PWordAny extends PAny {
  constructor(minl = 1, maxl = -1) {
    super(minl, maxl);
  }

  override toString = () => `<wordany ${this.minLength}:${this.maxLength}>`;
}
