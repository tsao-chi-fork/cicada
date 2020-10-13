import * as Value from "../value"
import * as Closure from "../closure"
import * as Telescope from "../telescope"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function readback_type_cls(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  cls: Value.cls
): Exp.Exp {
  ctx = Ctx.clone(ctx)
  // NOTE side-effect on ctx
  const norm_sat = readback_sat(mod, ctx, cls.sat)
  // NOTE `tel` has its own `tel.mod`
  const norm_scope = readback_scope(ctx, cls.tel)
  return Exp.cls(norm_sat, norm_scope)
}

function readback_sat(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  sat: Array<{ name: string; t: Value.Value; value: Value.Value }>
): Array<{ name: string; t: Exp.Exp; exp: Exp.Exp }> {
  const norm_sat = new Array()
  for (const entry of sat) {
    const name = entry.name
    const t = Value.readback(mod, ctx, Value.type, entry.t)
    const exp = Value.readback(mod, ctx, entry.t, entry.value)
    norm_sat.push({ name, t, exp })
    Ctx.update(ctx, name, entry.t, entry.value)
  }
  return norm_sat
}

function readback_scope(
  ctx: Ctx.Ctx,
  tel: Telescope.Telescope
): Array<{ name: string; t: Exp.Exp }> {
  const mod = Mod.clone(tel.mod)
  const norm_scope = new Array()
  const env = Env.clone(tel.env)
  if (tel.next !== undefined) {
    const name = tel.next.name
    const t = Value.readback(mod, ctx, Value.type, tel.next.t)
    norm_scope.push({ name, t })
    Ctx.update(ctx, name, tel.next.t)
    Env.update(env, name, Value.not_yet(tel.next.t, Neutral.v(name)))
  }

  for (const entry of tel.scope) {
    const name = entry.name
    const t_value = Exp.evaluate(mod, env, entry.t)
    const t = Value.readback(mod, ctx, Value.type, t_value)
    norm_scope.push({ name, t })
    Ctx.update(ctx, name, t_value)
    Env.update(env, name, Value.not_yet(t_value, Neutral.v(name)))
  }
  return norm_scope
}
