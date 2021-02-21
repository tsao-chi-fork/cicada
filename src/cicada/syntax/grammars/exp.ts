export const exp = {
  $grammar: {
    "exp:var": [{ name: "identifier" }],
    "exp:pi": [
      '"("',
      { name: "identifier" },
      '":"',
      { arg_t: "exp" },
      '")"',
      '"-"',
      '">"',
      { ret_t: "exp" },
    ],
    "exp:arrow": [
      '"("',
      { arg_t: "exp" },
      '")"',
      '"-"',
      '">"',
      { ret_t: "exp" },
    ],
    "exp:fn": [
      '"("',
      { name: "identifier" },
      '")"',
      '"="',
      '">"',
      { ret: "exp" },
    ],
    "exp:ap": [
      { target: "identifier" },
      { args: { $ap: ["one_or_more", '"("', "exp", '")"'] } },
    ],
    "exp:sigma": [
      '"("',
      { name: "identifier" },
      '":"',
      { car_t: "exp" },
      '")"',
      '"*"',
      { cdr_t: "exp" },
    ],
    "exp:pair": [
      '"Pair"',
      '"("',
      { car_t: "exp" },
      '","',
      { cdr_t: "exp" },
      '")"',
    ],
    "exp:cons": ['"cons"', '"("', { car: "exp" }, '","', { cdr: "exp" }, '")"'],
    "exp:car": ['"car"', '"("', { target: "exp" }, '")"'],
    "exp:cdr": ['"cdr"', '"("', { target: "exp" }, '")"'],
    "exp:nat": ['"Nat"'],
    "exp:zero": ['"zero"'],
    "exp:add1": ['"add1"', '"("', { prev: "exp" }, '")"'],
    "exp:number": [{ value: { $pattern: ["number"] } }],
    "exp:nat_ind": [
      '"Nat"',
      '"."',
      '"ind"',
      '"("',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '","',
      { base: "exp" },
      '","',
      { step: "exp" },
      '")"',
    ],
    "exp:equal": [
      '"Equal"',
      '"("',
      { t: "exp" },
      '","',
      { from: "exp" },
      '","',
      { to: "exp" },
      '")"',
    ],
    "exp:same": ['"same"'],
    "exp:replace": [
      '"replace"',
      '"("',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '","',
      { base: "exp" },
      '")"',
    ],
    "exp:trivial": ['"Trivial"'],
    "exp:sole": ['"sole"'],
    "exp:absurd": ['"Absurd"'],
    "exp:absurd_ind": [
      '"Absurd"',
      '"."',
      '"ind"',
      '"("',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '")"',
    ],
    "exp:str": ['"String"'],
    "exp:quote": [{ value: { $pattern: ["string"] } }],
    "exp:type": ['"Type"'],
    "exp:begin": ['"{"', { stmts: "stmts" }, { ret: "exp" }, '"}"'],
    "exp:let": [
      '"@"',
      '"let"',
      { name: "identifier" },
      '"="',
      { exp: "exp" },
      { ret: "exp" },
    ],
    "exp:deduction": [
      '"{"',
      { deduction_entries: { $ap: ["one_or_more", "deduction_entry"] } },
      { deduction_args: { $ap: ["zero_or_more", "exp"] } },
      '"}"',
    ],
  },
}

export const deduction_entry = {
  $grammar: {
    "deduction_entry:deduction_entry": [
      { t: "exp" },
      "dashline",
      { exp: "exp" },
    ],
  },
}
