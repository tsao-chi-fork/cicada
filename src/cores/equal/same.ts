import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { SameValue } from "../../cores"

export class Same extends Core {
  evaluate(ctx: Ctx, env: Env): Value {
    return new SameValue()
  }

  repr(): string {
    return "same"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "same"
  }
}
