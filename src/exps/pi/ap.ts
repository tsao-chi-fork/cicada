import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { evaluate } from "../../evaluate"
import { infer } from "../../infer"
import { check } from "../../check"
import { Value } from "../../value"
import { Trace } from "../../trace"
import * as ut from "../../ut"
import * as Cores from "../../cores"

export class Ap extends Exp {
  target: Exp
  arg: Exp

  constructor(target: Exp, arg: Exp) {
    super()
    this.target = target
    this.arg = arg
  }

  subst(name: string, exp: Exp): Exp {
    return new Ap(this.target.subst(name, exp), this.arg.subst(name, exp))
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    if (inferred_target.t instanceof Cores.PiValue) {
      const pi = inferred_target.t
      const arg_core = check(ctx, this.arg, pi.arg_t)
      const arg_value = evaluate(ctx.to_env(), arg_core)

      return {
        t: pi.ret_t_cl.apply(arg_value),
        core: new Cores.Ap(inferred_target.core, arg_core),
      }
    }

    const target_value = evaluate(ctx.to_env(), inferred_target.core)
    if (target_value instanceof Cores.ClsValue) {
      const cls = target_value
      let telescope = cls.telescope
      while (telescope.next) {
        const { name, t, value } = telescope.next
        if (value) {
          telescope = telescope.fill(value)
        } else {
          const arg_core = check(ctx, this.arg, t)

          return {
            t: new Cores.TypeValue(),
            core: new Cores.Ap(inferred_target.core, arg_core),
          }
        }
      }

      throw new Trace(
        ut.aline(`
          |The telescope is full.
          |`)
      )
    }

    throw new Trace(
      ut.aline(`
        |I am expecting value of type: PiValue or ClsValue.
        |`)
    )
  }

  repr(): string {
    return `${this.target.repr()}(${this.arg.repr()})`
  }
}
