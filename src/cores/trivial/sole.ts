import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Sole extends Core {
  evaluate(env: Env): Value {
    return new Cores.SoleValue()
  }

  repr(): string {
    return "sole"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "sole"
  }
}
