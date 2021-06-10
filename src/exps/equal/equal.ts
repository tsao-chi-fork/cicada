import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Equal extends Exp {
  t: Exp
  from: Exp
  to: Exp

  constructor(t: Exp, from: Exp, to: Exp) {
    super()
    this.t = t
    this.from = from
    this.to = to
  }

  subst(name: string, exp: Exp): Exp {
    return new Equal(
      this.t.subst(name, exp),
      this.from.subst(name, exp),
      this.to.subst(name, exp)
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const t_core = check(ctx, this.t, new Cores.TypeValue())
    const t_value = evaluate(ctx.to_env(), t_core)
    const from_core = check(ctx, this.from, t_value)
    const to_core = check(ctx, this.to, t_value)

    return {
      t: new Cores.TypeValue(),
      core: new Cores.Equal(t_core, from_core, to_core),
    }
  }

  repr(): string {
    return `Equal(${this.t.repr()}, ${this.from.repr()}, ${this.to.repr()})`
  }
}
