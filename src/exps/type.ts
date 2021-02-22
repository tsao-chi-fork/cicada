import { Exp, AlphaOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"

import * as Value from "../value"

export class Type implements Exp {
  kind = "Type"

  constructor() {}

  evaluate(env: Env): Value.Value {
    return Value.type
  }

  infer(ctx: Ctx): Value.Value {
    return Value.type
  }

  repr(): string {
    return "Type"
  }

  alpha_repr(opts: AlphaOpts): string {
    return "Type"
  }
}
