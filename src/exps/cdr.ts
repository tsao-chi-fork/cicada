import { Exp, AlphaReprOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Inferable } from "../inferable"
import { infer } from "../infer"
import { evaluate } from "../evaluate"
import * as Value from "../value"
import * as Explain from "../explain"
import * as Neutral from "../neutral"
import * as Trace from "../trace"
import { do_car } from "./car"

export class Cdr extends Object implements Exp {
  kind = "Cdr"
  target: Exp

  constructor(target: Exp) {
    super()
    this.target = target
  }

  evaluability({ env }: { env: Env }): Value.Value {
    return do_cdr(evaluate(env, this.target))
  }

  checkability(t: Value.Value, the: { ctx: Ctx }): void {
    return Inferable({
      inferability: ({ ctx }: { ctx: Ctx }) => {
        const target_t = infer(ctx, this.target)
        const sigma = Value.is_sigma(ctx, target_t)
        const car = do_car(evaluate(ctx.to_env(), this.target))
        return Value.Closure.apply(sigma.cdr_t_cl, car)
      },
    }).checkability(t, the)
  }

  inferability({ ctx }: { ctx: Ctx }): Value.Value {
    const target_t = infer(ctx, this.target)
    const sigma = Value.is_sigma(ctx, target_t)
    const car = do_car(evaluate(ctx.to_env(), this.target))
    return Value.Closure.apply(sigma.cdr_t_cl, car)
  }

  repr(): string {
    return `cdr(${this.target.repr()})`
  }

  alpha_repr(opts: AlphaReprOpts): string {
    return `cdr(${this.target.alpha_repr(opts)})`
  }
}

export function do_cdr(target: Value.Value): Value.Value {
  if (target.kind === "Value.cons") {
    return target.cdr
  } else if (target.kind === "Value.not_yet") {
    if (target.t.kind === "Value.sigma") {
      return Value.not_yet(
        Value.Closure.apply(target.t.cdr_t_cl, do_car(target)),
        Neutral.cdr(target.neutral)
      )
    } else {
      throw new Trace.Trace(
        Explain.explain_elim_target_type_mismatch({
          elim: "cdr",
          expecting: ["Value.sigma"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Explain.explain_elim_target_mismatch({
        elim: "cdr",
        expecting: ["Value.cons", "Value.not_yet"],
        reality: target.kind,
      })
    )
  }
}
