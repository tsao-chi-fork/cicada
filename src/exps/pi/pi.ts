import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { check } from "../../check"
import { evaluate } from "../../evaluate"
import * as Cores from "../../cores"

export class Pi extends Exp {
  name: string
  arg_t: Exp
  ret_t: Exp

  constructor(name: string, arg_t: Exp, ret_t: Exp) {
    super()
    this.name = name
    this.arg_t = arg_t
    this.ret_t = ret_t
  }

  subst(name: string, exp: Exp): Exp {
    if (name === this.name) {
      return new Pi(this.name, this.arg_t.subst(name, exp), this.ret_t)
    } else {
      return new Pi(
        this.name,
        this.arg_t.subst(name, exp),
        this.ret_t.subst(name, exp)
      )
    }
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const arg_t_core = check(ctx, this.arg_t, new Cores.TypeValue())
    const arg_t_value = evaluate(ctx.to_env(), arg_t_core)
    const ret_t_core = check(
      ctx.extend(this.name, arg_t_value),
      this.ret_t,
      new Cores.TypeValue()
    )

    return {
      t: new Cores.TypeValue(),
      core: new Cores.Pi(this.name, arg_t_core, ret_t_core),
    }
  }

  repr(): string {
    return `(${this.name}: ${this.arg_t.repr()}) -> ${this.ret_t.repr()}`
  }
}
