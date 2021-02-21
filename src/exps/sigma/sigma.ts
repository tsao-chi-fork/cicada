import { Exp } from "../../exp"
import { Inferable } from "../../inferable"
import { check } from "../../check"
import { evaluate } from "../../evaluate"
import * as Ctx from "../../ctx"
import * as Value from "../../value"

export type Sigma = Exp & {
  kind: "Sigma"
  name: string
  car_t: Exp
  cdr_t: Exp
}

export function Sigma(name: string, car_t: Exp, cdr_t: Exp): Sigma {
  return {
    kind: "Sigma",
    name,
    car_t,
    cdr_t,
    evaluability: ({ env }) =>
      Value.sigma(evaluate(env, car_t), Value.Closure.create(env, name, cdr_t)),
    ...Inferable({
      inferability: ({ ctx }) => {
        check(ctx, car_t, Value.type)
        const car_t_value = evaluate(ctx.to_env(), car_t)
        check(ctx.extend(name, car_t_value), cdr_t, Value.type)
        return Value.type
      },
    }),
    repr: () => `(${name}: ${car_t.repr()}) * ${cdr_t.repr()}`,
    alpha_repr: (opts) => {
      const cdr_t_repr = cdr_t.alpha_repr({
        depth: opts.depth + 1,
        depths: new Map([...opts.depths, [name, opts.depth]]),
      })
      return `(${car_t.alpha_repr(opts)}) * ${cdr_t_repr}`
    },
  }
}