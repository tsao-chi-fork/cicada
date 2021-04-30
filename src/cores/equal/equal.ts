import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Value } from "../../value"
import { TypeValue } from "../../cores"
import { EqualValue } from "../../cores"

export class Equal extends Core {
  t: Core
  from: Core
  to: Core

  constructor(t: Core, from: Core, to: Core) {
    super()
    this.t = t
    this.from = from
    this.to = to
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return new EqualValue(
      evaluate(ctx, env, this.t),
      evaluate(ctx, env, this.from),
      evaluate(ctx, env, this.to)
    )
  }

  repr(): string {
    return `Equal(${this.t.repr()}, ${this.from.repr()}, ${this.to.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `Equal(${this.t.alpha_repr(ctx)}, ${this.from.alpha_repr(
      ctx
    )}, ${this.to.alpha_repr(ctx)})`
  }
}
