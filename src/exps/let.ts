import { Exp } from "../exp"
import { Core } from "../core"
import { Value } from "../value"
import { Ctx } from "../ctx"
import { evaluate } from "../evaluate"
import { infer } from "../infer"
import { check } from "../check"
import * as Cores from "../cores"
import * as Exps from "../exps"
import * as ut from "../ut"

export class Let extends Exp {
  name: string
  exp: Exp
  ret: Exp

  constructor(name: string, exp: Exp, ret: Exp) {
    super()
    this.name = name
    this.exp = exp
    this.ret = ret
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.exp.free_names(bound_names),
      ...this.ret.free_names(new Set([...bound_names, this.name])),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    if (name === this.name) {
      return new Let(this.name, this.exp.subst(name, exp), this.ret)
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen_name(free_names, this.name)
      const ret = this.ret.rename(this.name, fresh_name)

      return new Let(
        fresh_name,
        this.exp.subst(name, exp),
        ret.subst(name, exp)
      )
    }
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const fresh_name = ut.freshen_name(new Set(ctx.names), this.name)
    const inferred = infer(ctx, this.exp)
    const value = evaluate(ctx.to_env(), inferred.core)
    const ret = this.ret.rename(this.name, fresh_name)
    const inferred_ret = infer(ctx.extend(fresh_name, inferred.t, value), ret)

    return {
      t: inferred_ret.t,
      core: new Cores.Let(fresh_name, inferred.core, inferred_ret.core),
    }
  }

  check(ctx: Ctx, t: Value): Core {
    const inferred = infer(ctx, this.exp)
    const value = evaluate(ctx.to_env(), inferred.core)
    const ret_core = check(
      ctx.extend(this.name, inferred.t, value),
      this.ret,
      t
    )
    return new Cores.Let(this.name, inferred.core, ret_core)
  }

  repr(): string {
    return `let ${this.name} = ${this.exp.repr()} ${this.ret.repr()}`
  }
}
