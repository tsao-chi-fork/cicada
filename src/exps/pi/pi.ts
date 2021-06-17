import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { check } from "../../check"
import { evaluate } from "../../evaluate"
import * as Cores from "../../cores"
import * as Exps from "../../exps"
import * as ut from "../../ut"

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

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.arg_t.free_names(bound_names),
      ...this.ret_t.free_names(new Set([...bound_names, this.name])),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    if (name === this.name) {
      return new Pi(this.name, this.arg_t.subst(name, exp), this.ret_t)
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen_name(free_names, this.name)
      const ret_t = this.ret_t.rename(this.name, fresh_name)

      return new Pi(
        fresh_name,
        this.arg_t.subst(name, exp),
        ret_t.subst(name, exp)
      )
    }
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const fresh_name = ut.freshen_name(new Set(ctx.names), this.name)
    const arg_t_core = check(ctx, this.arg_t, new Cores.TypeValue())
    const arg_t_value = evaluate(ctx.to_env(), arg_t_core)
    const ret_t = this.ret_t.rename(this.name, fresh_name)
    const ret_t_core = check(
      ctx.extend(fresh_name, arg_t_value),
      ret_t,
      new Cores.TypeValue()
    )

    return {
      t: new Cores.TypeValue(),
      core: new Cores.Pi(fresh_name, arg_t_core, ret_t_core),
    }
  }

  repr(): string {
    return `(${this.name}: ${this.arg_t.repr()}) -> ${this.ret_t.repr()}`
  }
}
