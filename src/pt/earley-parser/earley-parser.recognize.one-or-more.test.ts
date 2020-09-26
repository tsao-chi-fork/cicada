import * as EarleyParser from "../earley-parser"
import * as TableLexer from "../table-lexer"
import * as Mod from "../mod"
import * as Exp from "../exp"
import * as Token from "../token"
import assert from "assert"

const E = {
  "E:EQF": ["E", "Q", "F"],
  "E:F": ["F"],
}

const F = {
  "F:a": ['"a"'],
}

const Q = {
  "Q:+": ['"+"'],
  "Q:-": ['"-"'],
}

const one_or_more = {
  $fn: [
    "x",
    {
      "one_or_more:one": [{ value: "x" }],
      "one_or_more:more": [
        { head: "x" },
        { tail: { $ap: ["one_or_more", "x"] } },
      ],
    },
  ],
}

const S = {
  "S:S": [{ $ap: ["one_or_more", '"("', "E", '")"'] }],
}

export const mod = Mod.build({ E, F, Q, one_or_more, S })
export const grammar = Mod.dot(mod, "S")
export const parser = EarleyParser.create(grammar)
export const lexer = TableLexer.create([["char", /(.)/]])

function ok(test: string): void {
  assert(parser.recognize(lexer.lex(test)))
}

function no(test: string): void {
  assert(!parser.recognize(lexer.lex(test)))
}

ok("(a)")
ok("(a-a)")
ok("(a-a+a)")
ok("(a)(a)(a)")
ok("(a-a)(a-a)(a-a)")
ok("(a-a+a)(a-a+a)(a-a+a)")
ok("(a)(a-a)(a-a+a)")

no("a")
no("a-a")
no("a-a+a")
no("(a-a+a")

no("(a-a+b)")
no("(a-a++)")
no("a-a+b")
no("a-a++")
