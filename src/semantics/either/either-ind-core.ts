import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { check } from "../../exp"
import { Value } from "../../value"
import { Closure } from "../../closure"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Sem from "../../sem"
import {
  either_ind_motive_t,
  either_ind_base_left_t,
  either_ind_base_right_t,
} from "./either-ind"

export class EitherIndCore extends Core {
  target: Core
  motive: Core
  base_left: Core
  base_right: Core

  constructor(target: Core, motive: Core, base_left: Core, base_right: Core) {
    super()
    this.target = target
    this.motive = motive
    this.base_left = base_left
    this.base_right = base_right
  }

  evaluate(env: Env): Value {
    return EitherIndCore.apply(
      evaluate(env, this.target),
      evaluate(env, this.motive),
      evaluate(env, this.base_left),
      evaluate(env, this.base_right)
    )
  }

  repr(): string {
    const args = [
      this.target.repr(),
      this.motive.repr(),
      this.base_left.repr(),
      this.base_right.repr(),
    ].join(", ")

    return `either_ind(${args})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const args = [
      this.target.alpha_repr(ctx),
      this.motive.alpha_repr(ctx),
      this.base_left.alpha_repr(ctx),
      this.base_right.alpha_repr(ctx),
    ].join(", ")

    return `either_ind(${args})`
  }

  static apply(
    target: Value,
    motive: Value,
    base_left: Value,
    base_right: Value
  ): Value {
    if (target instanceof Sem.InlValue) {
      return Sem.ApCore.apply(base_left, target.left)
    } else if (target instanceof Sem.InrValue) {
      return Sem.ApCore.apply(base_right, target.right)
    } else if (target instanceof Sem.NotYetValue) {
      const { t, neutral } = target

      if (t instanceof Sem.EitherValue) {
        const motive_t = either_ind_motive_t(t)
        const base_left_t = either_ind_base_left_t(t.left_t, motive)
        const base_right_t = either_ind_base_right_t(t.right_t, motive)
        return new Sem.NotYetValue(
          Sem.ApCore.apply(motive, target),
          new Sem.EitherIndNeutral(
            neutral,
            new Normal(motive_t, motive),
            new Normal(base_left_t, base_left),
            new Normal(base_right_t, base_right)
          )
        )
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Sem.EitherValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Sem.InlValue, Sem.InrValue],
      })
    }
  }
}
