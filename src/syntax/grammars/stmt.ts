export const stmts = {
  $grammar: {
    "stmts:stmts": [{ stmts: { $ap: ["zero_or_more", "stmt"] } }],
  },
}

export const stmt = {
  $grammar: {
    "stmt:def": ['"@"', '"def"', { name: "identifier" }, { exp: "exp" }],
    "stmt:class": [
      '"@"',
      '"class"',
      { name: "identifier" },
      '"["',
      { entries: { $ap: ["zero_or_more", "cls_entry"] } },
      '"]"',
    ],
    "stmt:show": ['"@"', '"show"', { exp: "exp" }],
  },
}
