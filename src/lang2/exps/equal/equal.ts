import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import * as Value from "../../value"
import * as Ctx from "../../ctx"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Equal = Exp & {
    kind: "Exp.equal"
    t: Exp
    from: Exp
    to: Exp
  }

export function Equal(t: Exp, from: Exp, to: Exp): Equal {
  return {
    kind: "Exp.equal",
    t,
    from,
    to,
    evaluability: ({ env }) =>
      Value.equal(evaluate(env, t), evaluate(env, from), evaluate(env, to)),
    ...Inferable({
      inferability: ({ ctx }) => {
        check(ctx, t, Value.type)
        const t_value = evaluate(Ctx.to_env(ctx), t)
        check(ctx, from, t_value)
        check(ctx, to, t_value)
        return Value.type
      },
    }),
    repr: () => `Equal(${t.repr()}, ${from.repr()}, ${to.repr()})`,
    alpha_repr: (opts) =>
      `Equal(${t.alpha_repr(opts)}, ${from.alpha_repr(opts)}, ${to.alpha_repr(
        opts
      )})`,
  }
}
