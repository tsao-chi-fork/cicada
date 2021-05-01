import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Value } from "../../value"
import { nat_to_number } from "./nat-util"
import * as Cores from "../../cores"

export class Add1 extends Exp {
  prev: Exp

  constructor(prev: Exp) {
    super()
    this.prev = prev
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const t = new Cores.NatValue()
    const core = new Cores.Add1(check(ctx, this.prev, new Cores.NatValue()))
    return { t, core }
  }

  repr(): string {
    const n = nat_to_number(this)
    if (n !== undefined) {
      return n.toString()
    } else {
      return `add1(${this.prev.repr()})`
    }
  }
}
