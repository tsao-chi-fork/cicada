import * as Infer from "../infer"
import * as Check from "../check"
import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function infer_type_constructor(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  datatype: Exp.type_constructor
): Value.Value {
  check_type_constructor_t(mod, ctx, datatype.t)
  for (const entry of datatype.sums) {
    check_data_constructor_t(mod, ctx, entry.t, datatype.name)
  }
  return Evaluate.evaluate(mod, Ctx.to_env(ctx), datatype.t)
}

function check_data_constructor_t(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  t: Exp.Exp,
  name: string
): void {
  if (t.kind === "Exp.pi") {
    const pi = t
    Check.check(mod, ctx, pi.arg_t, Value.type)
    check_data_constructor_t(
      mod,
      Ctx.extend(
        ctx,
        pi.name,
        Evaluate.evaluate(mod, Ctx.to_env(ctx), pi.arg_t)
      ),
      pi.ret_t,
      name
    )
    return
  }

  Check.check(mod, ctx, t, Value.type)
  const t_value = Evaluate.evaluate(mod, Ctx.to_env(ctx), t)

  if (
    (t_value.kind === "Value.type_constructor" && t_value.name === name) ||
    (t_value.kind === "Value.datatype" &&
      t_value.type_constructor.name === name)
  ) {
    return
  }

  throw new Trace.Trace("the t should be pi or ap of type constructor")
}

function check_type_constructor_t(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  t: Exp.Exp
): void {
  if (t.kind === "Exp.pi") {
    const pi = t
    Check.check(mod, ctx, pi.arg_t, Value.type)
    check_type_constructor_t(
      mod,
      Ctx.extend(
        ctx,
        pi.name,
        Evaluate.evaluate(mod, Ctx.to_env(ctx), pi.arg_t)
      ),
      pi.ret_t
    )
    return
  }

  if (t.kind === "Exp.type") {
    return
  }

  throw new Trace.Trace("the t should be pi or type")
}
