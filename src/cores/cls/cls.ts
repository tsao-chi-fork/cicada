import { Core, AlphaCtx } from "../../core"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Telescope } from "../../telescope"
import { ClsValue } from "../../cores"
import { TypeValue } from "../../cores"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import * as ut from "../../ut"

export class Cls extends Core {
  entries: Array<{ name: string; t: Core; exp?: Core }>
  name?: string

  constructor(
    entries: Array<{ name: string; t: Core; exp?: Core }>,
    opts?: { name?: string }
  ) {
    super()
    this.entries = entries
    this.name = opts?.name
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return new ClsValue(new Telescope(ctx, env, this.entries), {
      name: this.name,
    })
  }

  repr(): string {
    const name = this.name ? `${this.name} ` : ""

    if (this.entries.length === 0) {
      return name + "[]"
    }

    const entries = this.entries.map(({ name, t, exp }) => {
      return exp
        ? `${name}: ${t.repr()} = ${exp.repr()}`
        : `${name}: ${t.repr()}`
    })

    const s = entries.join("\n")

    return name + `[\n${ut.indent(s, "  ")}\n]`
  }

  alpha_repr(ctx: AlphaCtx): string {
    if (this.entries.length === 0) return "[]"

    const parts = []

    for (const { name, t, exp } of this.entries) {
      const t_repr = t.alpha_repr(ctx)
      if (exp) {
        const exp_repr = exp.alpha_repr(ctx)
        parts.push(`${name} : ${t_repr} = ${exp_repr}`)
      } else {
        parts.push(`${name} : ${t_repr}`)
      }
      ctx = ctx.extend(name)
    }

    const s = parts.join("\n")

    return `[\n${ut.indent(s, "  ")}\n]`
  }
}