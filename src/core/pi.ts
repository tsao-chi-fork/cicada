import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import * as Value from "../value"
import { check } from "../check"
import { evaluate } from "../evaluate"

export class Pi implements Exp {
  name: string
  arg_t: Exp
  ret_t: Exp

  constructor(name: string, arg_t: Exp, ret_t: Exp) {
    this.name = name
    this.arg_t = arg_t
    this.ret_t = ret_t
  }

  evaluate(env: Env): Value.Value {
    return Value.pi(
      evaluate(env, this.arg_t),
      Value.Closure.create(env, this.name, this.ret_t)
    )
  }

  infer(ctx: Ctx): Value.Value {
    check(ctx, this.arg_t, Value.type)
    const arg_t_value = evaluate(ctx.to_env(), this.arg_t)
    check(ctx.extend(this.name, arg_t_value), this.ret_t, Value.type)
    return Value.type
  }

  repr(): string {
    return `(${this.name}: ${this.arg_t.repr()}) -> ${this.ret_t.repr()}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const arg_t_repr = this.arg_t.alpha_repr(ctx)
    const ret_t_repr = this.ret_t.alpha_repr(ctx.extend(this.name))
    return `(${arg_t_repr}) -> ${ret_t_repr}`
  }
}