import { Exp } from "../exp"
import { Value } from "../value"
import { Env } from "../env"
import { Ctx } from "../ctx"
import { evaluate } from "../evaluate"
import { infer } from "../infer"
import { check } from "../check"
import { TypeValue } from "../cores"

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

  evaluate(ctx: Ctx, env: Env): Value {
    // const t = infer(ctx, this.exp)

    // TODO the following use of `new TypeValue()` is placeholder.
    const t = new TypeValue()

    const value = evaluate(ctx, env, this.exp)
    return evaluate(
      ctx.extend(this.name, t, value),
      env.extend(this.name, t, value),
      this.ret
    )
  }

  infer(ctx: Ctx): Value {
    return infer(
      ctx.extend(
        this.name,
        infer(ctx, this.exp),
        evaluate(ctx, ctx.to_env(), this.exp)
      ),
      this.ret
    )
  }

  check(ctx: Ctx, t: Value): void {
    check(
      ctx.extend(
        this.name,
        infer(ctx, this.exp),
        evaluate(ctx, ctx.to_env(), this.exp)
      ),
      this.ret,
      t
    )
  }

  repr(): string {
    return `@let ${this.name} = ${this.exp.repr()} ${this.ret.repr()}`
  }
}