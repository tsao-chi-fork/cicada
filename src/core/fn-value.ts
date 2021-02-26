import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Value } from "../value"
import * as Closure from "../value/closure"
import { readback } from "../readback"
import { PiValue } from "./pi-value"
import { Fn } from "./fn"

export class FnValue {
  ret_cl: Closure.Closure

  constructor(ret_cl: Closure.Closure) {
    this.ret_cl = ret_cl
  }

  readback(ctx: Ctx, t: Value): Exp | undefined {
    // TODO
    return undefined
  }
}