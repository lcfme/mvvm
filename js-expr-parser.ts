interface CompilerPrototype<R, P, N> {
  read(): R;
  peek(): P;
  next(): N;
}

interface Token<T> {
  Type: string;
  Value: T;
}

const OPERATORS = [];

const PRIFIX_OPERATOR = [];
const INFIX_OPERATOR = [];
const POSTFIX_OPERATOR = [];

function Lexer(input: any): CompilerPrototype<string, string, Token<any>> {
  if (typeof input !== "string") {
    throw new Error(
      "invalid type of input, expected string but got: " + typeof input
    );
  }

  function skipWhiteSpace(l: Lexer) {
    let ch = l.peek();
    while (ch && /\s/.test(ch)) {
      ch = l.read();
    }
  }

  class Lexer implements Lexer {
    at: number = 0;
    input: string = "";
    ch: string = "";
    constructor(input: string) {
      this.input = input;
    }
    read(): string {
      const ch = (this.ch = this.input.charAt(this.at));
      if (ch === "") {
        return ch;
      }
      this.at++;
      return ch;
    }
    peek(): string {
      return this.ch || this.read();
    }
    next(): Token<any> {
      skipWhiteSpace(this);
      const ch = this.peek();
      if (ch === "") {
        return null;
      }
      switch (ch) {
        case "":
      }
      return {
        Type: "",
        Value: undefined
      };
    }
  }
  return new Lexer(input);
}
